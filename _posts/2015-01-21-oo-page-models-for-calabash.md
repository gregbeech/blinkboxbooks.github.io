---
layout: post
title: "Testing mobile apps with Calabash: object oriented page models"
author: aikhelis
---

# Overview

We're using http://calaba.sh/ for automation of native Android and iOS applications. It's a great tool, however (at the moment of writing) we believe that it's still at the maturing stage. Elements operations API could be improved for usability and better fit into the Ruby style. Also UI modelling capabilities of the built-in page models is limiting. We were not convinced that RPC style of calabash operations is dictated by the nature of native Mobile and that's its conceptually different from automating Web apps.

Inspired by reach experience with tools for Web automation such as Selenium, Capybara and Siteprism, we have implemented a thin layer on top of calabash operations. Effectively, it's just an OO adaptor (class Element) transforming methods of our Element class into calabash RPC calls upon elements' selectors. We use Ruby meta-programming for lookup and delegation to the corresponding calabash operations. 

## Pros

- OO model similar to the API of classic open source tools for web such as Selenium, Watir and Capybara.
- This facilitates page objects with API similar to the frameworks, people have been using for web (we quite like siteprism for capybara)
-- Which makes an easier re-use between web and mobile test codebases
- We believe, code becomes more readable this way

## Cons
As any extra layer, it comes at a cost:

- maintenance as calabash-android library may change in the future 
- performance can be slower due to methods lookup and delegation
- debugging becomes slightly harder
- there're some side effects, similar to https://github.com/calabash/calabash-ios/issues/531. That's a lot to do with the code organisation of calabash itself, which patched with a simple stub.

## Implementation notes

- By keeping layer reasonably thin, we minimise maintenance cost as calabash operations API evolve. Ideally, this (or similar) becomes a part of calabash or a separate gem (e.g. an implementation of page model for calabash-android).
- By simple delegation (proxying) to the calabash RPC operations, we prevent Element objects from becoming stale (see code sample below). In the Element class we do not store anything except the selector. If element with selector "foobar" becomes unavailable, we will receive exception from the #touch method same way as if we called #tap("foobar"). 

{% highlight ruby %}
# stale element example
foobar = Element.new("foobar") # save foobar selector
... #do something on the screen
foobar.touch() # at this point foobar may not be available in the UI anymore. We will receive same exception as if we called touch("foobar")
{% endhighlight %}

## Next steps:

- Distinguish base class for Sections from Page base class and support section selectors (trait for a section defined within a specific page)
- Support collection of elements and sections
- This could grow into an abstraction layer on top of any mobile automation driver (e.g. Appium); if we have to switch at some point later, or would like to re-use the same POM API for an automation project on top of a different driver. We even had an idea to grow it into a driver for capybara, but were not convinced that the game would be worth the candle.

## Code snapshots
### class Element

{% highlight ruby %}
module PageObjectModel
  module CalabashProxy
    require 'calabash-android/operations'
    include Calabash::Android::Operations
  end
end

module PageObjectModel
  class Element
    # Adding logging capabilities (logger instance used below) into the page objects - Out of this article scope
    include Logging
 
    attr_reader :selector

    def initialize selector
      @selector = selector
    end

    private
    def calabash_proxy
      @calabash_proxy ||= Class.new.extend(PageObjectModel::CalabashProxy)
    end

    public
    def attributes
      query = calabash_proxy.query(selector)
      fail "Unable to locate element \##{selector}" if query.empty?
      query.first
    end

    def has_attribute?(attr)
      attributes.key?(attr)
    end

    # One of the extensions to the current calabash operations API, which we're happy with
    # for the sake of proper ruby paradigm behind method names
    def exists? 
      calabash_proxy.element_exists(selector)
    end
 
    def enabled?
      attributes['enabled']
    end
 
    # For text-field and alike
    def set(text)
      clear_text
      enter_text(text)
    end
    
    # For checkbox and alike
    def selected?
      attributes['isSelected']
    end
 
    def set_checked()
      tap unless selected?
    end

    def set_unchecked()
      tap if selected?
    end

    # @examples:
    #
    #    my_element.touch --> calabash_proxy.touch(selector)
    #    my_field.enter_text("hello") --> calabash_proxy.enter_text(selector, "hello")
    #    my_field.text --> my_field.attributes['text']
    #    my_element.non_existing_method --> raise NoMethodError
    def method_missing(method_name, *args, &block)
      if calabash_proxy.respond_to?(method_name.to_sym)
        logger.debug %(Delegating method call \##{method_name}(#{args.join(', ')}) for selector "#{selector}" to calabash)
        calabash_proxy.send(method_name.to_sym, selector, *args, &block)
      elsif has_attribute?(method_name.to_s)
        logger.debug %(Fetching element attribute \##{method_name} for selector "#{selector}")
        attributes[method_name.to_s]
      else
        raise NoMethodError, %(undefined method '#{method_name}' for \##{self.class.inspect} with selector "#{selector}")
      end
    end
  end
end
{% endhighlight %}

### Page and Section objects (elements definition DSL)

{% highlight ruby %}
# Base page class
module PageObjectModel
  require 'calabash-android/abase'
  class Page < Calabash::ABase
    #...
    def self.element(identity, selector)
      class_eval %Q{
        def #{identity}
        @_#{identity} ||= Element.new("#{selector}")
    end
    }
    end

    def self.section(identity, classname)
      class_eval %Q{
        def #{identity}
          @_#{identity} ||= page(#{classname})
        end
      }
    end
    #...
  end
end

# Section and page example
module PageObjectModel
  class SignInForm < Page
    trait "TextView marked:'Sign in'"
    element :email_field, "* id:'edittext_email'"
    element :password_field, "* id:'edittext_password'"
    element :signin_button, "* id:'button_signin'"
    element :signin_label, "* id:'Sign in'"

    def submit_sign_in_details(user_name, password)
      email_field.set user_name
      password_field.set password
      signin_button.scroll_to 
      signin_button.touch
    end
  end
 
  class HomePage < Page
    trait "TextView marked:'Welcome'"
    section :sign_in_form, SignInForm
    element :back_button, ""* id:'back'""    
 
    def go_back
      back_button.touch
    end
  end
end
{% endhighlight %}

### Usage in Step Definitions 

{% highlight ruby %}
When(/^I submit valid sign in details$/) do
  username = test_data[:user][:username]
  password = test_data[:user][:password]
  home_page.sign_in_form.submit_sign_in_details(username, password)
end

When(/^I go back to the Anonymous Library page$/) do
  home_page.await
  home_page.go_back
  anonymous_library_page.await
end
 
Then(/^I should see sign out option in the drawer menu$/) do
  user_library_page.open_drawer_menu
  expect(user_library_page.signout_button).to exist
end
{% endhighlight %}

## Comparison to Calabash RPC approach

For comparison, this is how it could be done in the RPC model of Calabash operations.
Extracting sign in form into a Section is omitted for simplicity.

{% highlight ruby %}
# base page class
module PageObjectModel
  require 'calabash-android/abase'

  class Page < Calabash::ABase
    #...
    def self.element(identity, selector)
      class_eval %Q{
      def #{identity}
        @_#{identity} = selector
    end
      }
    end
    #...
  end
end
 
#SignIn page model
module PageObjectModel
  class SignInPage < PageObjectModel::Page
    trait "TextView marked:'Sign in'"
    element :email_field, "* id:'edittext_email'"
    element :password_field, "* id:'edittext_password'"
    element :signin_button, "* id:'button_signin'"
    element :signin_label, "* text:'Sign in'"

    def submit_sign_in_details(user_name, password)
      clear_text(email_field)
      enter_text(email_field, user_name)
      
      clear_text(password_field)
      enter_text(password_field, password)
      
      scroll_to(signin_button)
      touch(signin_button)
    end

    def go_back
      touch(signin_label)
    end
  end
end
 
#step definitions
Then(/^I should see sign out option in the drawer menu$/) do
  user_library_page.open_drawer_menu
  expect(element_exists(user_library_page.signout_button)).to be true
end
{% endhighlight %}
