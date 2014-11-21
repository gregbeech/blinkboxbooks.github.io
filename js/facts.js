if (!window.console) console = {log: function() {}};

(function(){
  function getFact() {
    var types = Object.keys(facts);
    var type = types[Math.floor(Math.random() * types.length)];
    var fact = facts[type][Math.floor(Math.random() * facts[type].length)];
    var text = '#' + type + 'fact: ' + fact;
    return text;
  }
  function logFact() {
    console.log(getFact());
  }
  function displayFact() {
    alert(getFact());
  }
  setInterval(logFact, 10000);
  new Konami(displayFact);

  // Facts
  var facts = {
    cat: [
      "A cat can travel at a top speed of approximately 31 mph (49 km) over a short distance.",
      "Approximately 24 cat skins can make a coat.",
      "The richest cat is Blackie who was left £15 million by his owner, Ben Rea.",
      "A cat has 230 bones in its body. A human has 206. A cat has no collarbone, so it can fit through any opening the size of its head.",
      "The tiniest cat on record is Mr. Pebbles, a 2-year-old cat that weighed 1.3 kg and was 15.5 cm high.",
      "Approximately 1/3 of cat owners think their pets are able to read their minds."
    ],
    cheese: [
      "Cheese is made from milk and it takes around 10 litres of milk to make 1kg of hard cheese.",
      "Cheese can be made from lots of different types of milk, such as buffaloes' milk, sheep's milk and goats' milk; most of the cheese eaten in the UK is made from cows' milk.",
      "We all know that \"Little Miss Muffet sat on her tuffet, eating her Curds and Whey\" but I bet you didn't know that to make cheese, milk has to be separated into curds which are the lumpy bits and whey which is the liquid bit. We make cheese with the curds!",
      "Some cheeses, like Mature Cheddar, are stored for one year or longer before they are ready to eat. They are kept in special rooms and sometimes even caves!",
      "There are over 700 different named cheeses produced in Britain.",
      "Cheddar is named after the Cheddar Gorge caves in Somerset where the cheese used to be stored to ripen. Cheddar is one of the most widely made cheeses in the world. King Henry II declared Cheddar cheese to be the best in Britain!",
      "The majority of Shropshire Blue is not actually made in Shropshire, but in Leicestershire and Nottinghamshire.",
      "Cheshire is one of the oldest British cheeses. It dates from Roman times and even gets a mention in the Domesday Book",
      "Cornish Yarg came from a recipe found in a book in a farmer's attic - his name was Mr Gray (Yarg spelt backwards!)",
      "Caerphilly was traditionally eaten by Welsh coal miners for their lunch.",
      "Every spring sees locals in the village of Stilton, Peterborough, race along a course rolling Stilton shaped wheels.",
      "Cheese comes in many different colours, textures, tastes and appearances. They can be hard, soft and some are runny!",
      "Cheese is packed with the protein that we all need for growth and development.",
      "Hard cheese is source of calcium with a matchbox-sized piece providing a third of an adult's daily requirement for calcium.",
      "Cheese is a source of vitamin B12, which you need for red blood cell formation.",
      "Each day our friends in France, Italy, Greece and Germany eat more than twice as much cheese, per person, as we do.",
      "Cheese is one of the most versatile foods around and can be used as a starter, a main course or as a dessert - you can't do that with many other foods!",
      "Spanish architect Gaudi invented the Dutch cheese Gouda"
    ],
    animal: [
      "The heart of a whale is the size of a small family car.",
      "Kenya's Camel Mobile Library goes around remote regions carrying about 400 books.",
      "Anteaters were named after the Duke of Eater, whose first name was Anthony.",
      "Sea otters hold hands when they sleep to stop them drifting apart.",
      "If you were to take all of the veins in your body and lie them out end-to-end you would die.",
      "Giant camels existed around 100,000 bc. They were twice the size of modern camels – twelve feet tall.",
      "Kingfishers dive so fast that they can penetrate a layer of ice to catch a fish.",
      "Russian Meerkats listen to Enya."
    ],
    sandwich: [
      "Ham sandwiches were originally developed as a method to transport secret messages encoded in cured meats.",
      "Al Gore invented the internet.",
      "Americans eat more than 300 million sandwiches every day."
    ]
  }
})();