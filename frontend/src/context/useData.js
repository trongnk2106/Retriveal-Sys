import React, { useContext, useState } from 'react'

export const DataContext = React.createContext([{}]);

export const DataProvider = ({ children }) => {
    const [Video_keyframe, setVideoKeyframe] = useState([{}])
    const [datasub, setDatasub] = useState(['Video Name', "Key Frame"])
    const [VideoList, setVideoList] = useState([{}])
    const [VideoListObject, setVideoListObject] = useState([{}])
    const [startPoint, setStartPoint] = useState({ x: 0 , y: 0 });
    const [endPoint, setEndPoint] = useState({ x: 1280, y: 720 });
    const [submit, setSubmit] = useState()
    // const [startPoint, setStartPoint] = useState({ x: null, y : null });
    // const [endPoint, setEndPoint] = useState({ x: null, y: null });
    const [keyframeKnn, setKeyframeKnn] = useState('')
    const [dataKNN, setDataKNN] = useState({
      path: "",
      top_left: {},
      bottom_right: {}
    })

    const [knn, setKnn] = useState(false)
    const [flag, setFlag] = useState(false);
    
    const options =[{value: "Bathroom accessory", label: "Bathroom accessory"}, {value: "Television", label: "Television"}, {value: "Snowmobile", label: "Snowmobile"}, 
    {value: "Doll", label: "Doll"}, {value: "Lavender", label: "Lavender"}, {value: "Office building", label: "Office building"}, {value: "Chopsticks", label: "Chopsticks"}, 
  {value: "Baseball glove", label: "Baseball glove"}, {value: "Ladder", label: "Ladder"}, {value: "Stop sign", label: "Stop sign"}, {value: "Bookcase", label: "Bookcase"},
  {value: "Wine", label: "Wine"}, {value: "Guacamole", label: "Guacamole"}, {value: "Lantern", label: "Lantern"}, {value: "Rocket", label: "Rocket"}, {value: "Personal care", label: "Personal care"},
  {value: "Sombrero", label: "Sombrero"}, {value: "Whiteboard", label: "Whiteboard"}, {value: "Land vehicle", label: "Land vehicle"}, {value: "Syringe", label: "Syringe"},
  {value: "Golf ball", label: "Golf ball"}, {value: "Butterfly", label: "Butterfly"}, {value: "Human leg", label: "Human leg"}, {value: "Scoreboard", label: "Scoreboard"}, 
  {value: "Ambulance", label: "Ambulance"}, {value: "Submarine", label: "Submarine"}, {value: "Pomegranate", label: "Pomegranate"}, {value: "Poster", label: "Poster"},
  {value: "Kitchen & dining room table", label: "Kitchen & dining room table"}, {value: "Adhesive tape", label: "Adhesive tape"}, {value: "Camera", label: "Camera"}, 
  {value: "Desk", label: "Desk"}, {value: "Honeycomb", label: "Honeycomb"}, {value: "Sculpture", label: "Sculpture"}, {value: "Orange", label: "Orange"}, {value: "Swim cap", label: "Swim cap"},
  {value: "Human arm", label: "Human arm"}, {value: "Street light", label: "Street light"}, {value: "Shrimp", label: "Shrimp"}, {value: "Insect", label: "Insect"}, 
  {value: "Hippopotamus", label: "Hippopotamus"}, {value: "Pretzel", label: "Pretzel"}, {value: "Fruit", label: "Fruit"}, {value: "Nail", label: "Nail"},
  {value: "Toothbrush", label: "Toothbrush"}, {value: "Weapon", label: "Weapon"}, {value: "Grapefruit", label: "Grapefruit"}, {value: "Cello", label: "Cello"},
  {value: "Watch", label: "Watch"}, {value: "Traffic light", label: "Traffic light"}, {value: "Scissors", label: "Scissors"}, {value: "Building", label: "Building"}, 
  {value: "Drill", label: "Drill"}, {value: "Strawberry", label: "Strawberry"}, {value: "Bicycle helmet", label: "Bicycle helmet"}, {value: "Pasta", label: "Pasta"},
  {value: "Plumbing fixture", label: "Plumbing fixture"}, {value: "Furniture", label: "Furniture"}, {value: "Brassiere", label: "Brassiere"}, {value: "Spoon", label: "Spoon"},
  {value: "Crocodile", label: "Crocodile"}, {value: "Snowboard", label: "Snowboard"}, {value: "Bear", label: "Bear"}, {value: "Squirrel", label: "Squirrel"}, {value: "Cattle", label: "Cattle"},
  {value: "Briefcase", label: "Briefcase"}, {value: "Ipod", label: "Ipod"}, {value: "Auto part", label: "Auto part"}, {value: "Snowman", label: "Snowman"},
  {value: "Billiard table", label: "Billiard table"}, {value: "Pastry", label: "Pastry"}, {value: "Plant", label: "Plant"}, {value: "Kite", label: "Kite"},
  {value: "Shorts", label: "Shorts"}, {value: "Egg", label: "Egg"}, {value: "Antelope", label: "Antelope"}, {value: "Frying pan", label: "Frying pan"}, {value: "Tank", label: "Tank"},
  {value: "Limousine", label: "Limousine"}, {value: "Cart", label: "Cart"}, {value: "Office supplies", label: "Office supplies"}, {value: "Hot dog", label: "Hot dog"}, 
  {value: "Mirror", label: "Mirror"}, {value: "Football helmet", label: "Football helmet"}, {value: "Squid", label: "Squid"}, {value: "Banjo", label: "Banjo"},
  {value: "Aircraft", label: "Aircraft"}, {value: "Eagle", label: "Eagle"}, {value: "Man", label: "Man"}, {value: "Picnic basket", label: "Picnic basket"},
  {value: "Backpack", label: "Backpack"}, {value: "Red panda", label: "Red panda"}, {value: "Fork", label: "Fork"}, {value: "Tire", label: "Tire"}, {value: "Train", label: "Train"}, 
  {value: "Lifejacket", label: "Lifejacket"}, {value: "Salt and pepper shakers", label: "Salt and pepper shakers"}, {value: "Rabbit", label: "Rabbit"}, {value: "Jet ski", label: "Jet ski"},
  {value: "Beaker", label: "Beaker"}, {value: "Luggage and bags", label: "Luggage and bags"}, {value: "Swimming pool", label: "Swimming pool"}, {value: "Dice", label: "Dice"}, 
  {value: "Kitchen utensil", label: "Kitchen utensil"}, {value: "Segway", label: "Segway"}, {value: "Measuring cup", label: "Measuring cup"}, {value: "Human face", label: "Human face"},
  {value: "Juice", label: "Juice"}, {value: "Oboe", label: "Oboe"}, {value: "Shark", label: "Shark"}, {value: "Couch", label: "Couch"}, {value: "Picture frame", label: "Picture frame"},
  {value: "Fedora", label: "Fedora"}, {value: "Bench", label: "Bench"}, {value: "Pig", label: "Pig"}, {value: "Lemon", label: "Lemon"}, {value: "Animal", label: "Animal"}, 
  {value: "Banana", label: "Banana"}, {value: "Whale", label: "Whale"}, {value: "Wheelchair", label: "Wheelchair"}, {value: "Suit", label: "Suit"}, {value: "Tap", label: "Tap"},
  {value: "Paddle", label: "Paddle"}, {value: "Porch", label: "Porch"}, {value: "Girl", label: "Girl"}, {value: "Mango", label: "Mango"}, {value: "Cabbage", label: "Cabbage"}, 
  {value: "Gas stove", label: "Gas stove"}, {value: "Human hand", label: "Human hand"}, {value: "Handbag", label: "Handbag"}, {value: "Wheel", label: "Wheel"}, 
  {value: "Convenience store", label: "Convenience store"}, {value: "Lion", label: "Lion"}, {value: "Suitcase", label: "Suitcase"}, {value: "Leopard", label: "Leopard"},
  {value: "Food", label: "Food"}, {value: "Horn", label: "Horn"}, {value: "Tennis ball", label: "Tennis ball"}, {value: "Oyster", label: "Oyster"}, {value: "Boy", label: "Boy"},
  {value: "Seahorse", label: "Seahorse"}, {value: "Harpsichord", label: "Harpsichord"}, {value: "Cantaloupe", label: "Cantaloupe"}, {value: "Tripod", label: "Tripod"},
  {value: "Wall clock", label: "Wall clock"}, {value: "Kitchen appliance", label: "Kitchen appliance"}, {value: "Bust", label: "Bust"}, {value: "Mammal", label: "Mammal"},
  {value: "Watermelon", label: "Watermelon"}, {value: "Castle", label: "Castle"}, {value: "Studio couch", label: "Studio couch"}, {value: "Cabinetry", label: "Cabinetry"},
  {value: "Helicopter", label: "Helicopter"}, {value: "Gondola", label: "Gondola"}, {value: "Candle", label: "Candle"}, {value: "Cat", label: "Cat"}, {value: "Peach", label: "Peach"},
  {value: "Toy", label: "Toy"}, {value: "Rose", label: "Rose"}, {value: "Palm tree", label: "Palm tree"}, {value: "Alpaca", label: "Alpaca"}, {value: "Broccoli", label: "Broccoli"}, 
  {value: "Tablet computer", label: "Tablet computer"}, {value: "Ball", label: "Ball"}, {value: "Scale", label: "Scale"}, {value: "Fish", label: "Fish"}, {value: "Drawer", label: "Drawer"}, 
  {value: "Light switch", label: "Light switch"}, {value: "Digital clock", label: "Digital clock"}, {value: "Wine glass", label: "Wine glass"}, {value: "Paper towel", label: "Paper towel"}, 
  {value: "Box", label: "Box"}, {value: "Dolphin", label: "Dolphin"}, {value: "Elephant", label: "Elephant"}, {value: "Scorpion", label: "Scorpion"}, {value: "Trousers", label: "Trousers"}, 
  {value: "Necklace", label: "Necklace"}, {value: "Mushroom", label: "Mushroom"}, {value: "Plate", label: "Plate"}, {value: "Maple", label: "Maple"}, {value: "Tiara", label: "Tiara"}, 
  {value: "Cake stand", label: "Cake stand"}, {value: "Owl", label: "Owl"}, {value: "House", label: "House"}, {value: "Infant bed", label: "Infant bed"}, {value: "Houseplant", label: "Houseplant"},
  {value: "Drinking straw", label: "Drinking straw"}, {value: "Koala", label: "Koala"}, {value: "Soap dispenser", label: "Soap dispenser"}, {value: "Teddy bear", label: "Teddy bear"}, 
  {value: "Racket", label: "Racket"}, {value: "Candy", label: "Candy"}, {value: "Swan", label: "Swan"}, {value: "Chicken", label: "Chicken"}, {value: "Starfish", label: "Starfish"},
  {value: "Otter", label: "Otter"}, {value: "Sandal", label: "Sandal"}, {value: "Chair", label: "Chair"}, {value: "Goldfish", label: "Goldfish"}, {value: "Trombone", label: "Trombone"}, 
  {value: "Carrot", label: "Carrot"}, {value: "Bicycle", label: "Bicycle"}, {value: "Guitar", label: "Guitar"}, {value: "Organ", label: "Organ"}, {value: "Boat", label: "Boat"},
  {value: "Vehicle registration plate", label: "Vehicle registration plate"}, {value: "Table", label: "Table"}, {value: "Cowboy hat", label: "Cowboy hat"}, {value: "Cannon", label: "Cannon"}, 
  {value: "Penguin", label: "Penguin"}, {value: "Umbrella", label: "Umbrella"}, {value: "Belt", label: "Belt"}, {value: "Van", label: "Van"}, {value: "Bottle", label: "Bottle"},
  {value: "Sofa bed", label: "Sofa bed"}, {value: "Cassette deck", label: "Cassette deck"}, {value: "Medical equipment", label: "Medical equipment"}, 
  {value: "Goose", label: "Goose"}, {value: "Bronze sculpture", label: "Bronze sculpture"}, {value: "Computer keyboard", label: "Computer keyboard"}, 
  {value: "Musical instrument", label: "Musical instrument"}, {value: "Envelope", label: "Envelope"}, {value: "Cheese", label: "Cheese"}, {value: "Parrot", label: "Parrot"},
  {value: "Telephone", label: "Telephone"}, {value: "Trumpet", label: "Trumpet"}, {value: "Shower", label: "Shower"}, {value: "Football", label: "Football"}, 
  {value: "Sunflower", label: "Sunflower"}, {value: "Skirt", label: "Skirt"}, {value: "Cookie", label: "Cookie"}, {value: "Saxophone", label: "Saxophone"},
  {value: "Raven", label: "Raven"}, {value: "Woman", label: "Woman"}, {value: "Rifle", label: "Rifle"}, {value: "Motorcycle", label: "Motorcycle"}, 
  {value: "Computer monitor", label: "Computer monitor"}, {value: "Polar bear", label: "Polar bear"}, {value: "Accordion", label: "Accordion"}, {value: "High heels", label: "High heels"}, 
  {value: "Beer", label: "Beer"}, {value: "Blue jay", label: "Blue jay"}, {value: "Coffee", label: "Coffee"}, {value: "Beetle", label: "Beetle"}, {value: "Bread", label: "Bread"}, 
  {value: "Calculator", label: "Calculator"}, {value: "Door", label: "Door"}, {value: "Ratchet", label: "Ratchet"}, {value: "Punching bag", label: "Punching bag"}, {value: "Stretcher", label: "Stretcher"}, 
  {value: "Jacket", label: "Jacket"}, {value: "Volleyball", label: "Volleyball"}, {value: "Pear", label: "Pear"}, {value: "Wood-burning stove", label: "Wood-burning stove"}, 
  {value: "Rugby ball", label: "Rugby ball"}, {value: "Missile", label: "Missile"}, {value: "Towel", label: "Towel"}, {value: "Cupboard", label: "Cupboard"}, {value: "Earrings", label: "Earrings"},
  {value: "Hat", label: "Hat"}, {value: "Window", label: "Window"}, {value: "Handgun", label: "Handgun"}, {value: "Clothing", label: "Clothing"}, {value: "Flying disc", label: "Flying disc"}, 
  {value: "Tin can", label: "Tin can"}, {value: "Baseball bat", label: "Baseball bat"}, {value: "Mobile phone", label: "Mobile phone"}, {value: "Seat belt", label: "Seat belt"}, 
  {value: "Taco", label: "Taco"}, {value: "Human ear", label: "Human ear"}, {value: "Mixer", label: "Mixer"}, {value: "Dress", label: "Dress"}, {value: "Drink", label: "Drink"}, 
  {value: "Coat", label: "Coat"}, {value: "Human eye", label: "Human eye"}, {value: "Pillow", label: "Pillow"}, {value: "Ceiling fan", label: "Ceiling fan"}, 
  {value: "Ruler", label: "Ruler"}, {value: "Nightstand", label: "Nightstand"}, {value: "Flute", label: "Flute"}, {value: "Snake", label: "Snake"},
  {value: "Airplane", label: "Airplane"}, {value: "Ostrich", label: "Ostrich"}, {value: "Artichoke", label: "Artichoke"}, {value: "Countertop", label: "Countertop"}, 
  {value: "Human head", label: "Human head"}, {value: "Swimwear", label: "Swimwear"}, {value: "Camel", label: "Camel"}, {value: "Pitcher", label: "Pitcher"}, 
  {value: "Scarf", label: "Scarf"}, {value: "Tent", label: "Tent"}, {value: "Dog", label: "Dog"}, {value: "Knife", label: "Knife"}, {value: "Coin", label: "Coin"}, 
  {value: "Tool", label: "Tool"}, {value: "Laptop", label: "Laptop"}, {value: "Lighthouse", label: "Lighthouse"}, {value: "Sparrow", label: "Sparrow"}, {value: "Balloon", label: "Balloon"}, 
  {value: "Popcorn", label: "Popcorn"}, {value: "Door handle", label: "Door handle"}, {value: "Turtle", label: "Turtle"}, {value: "Coffeemaker", label: "Coffeemaker"}, {value: "Panda", label: "Panda"}, 
  {value: "Kettle", label: "Kettle"}, {value: "Piano", label: "Piano"}, {value: "Drum", label: "Drum"}, {value: "Shelf", label: "Shelf"}, {value: "Bird", label: "Bird"}, 
  {value: "Human beard", label: "Human beard"}, {value: "Sunglasses", label: "Sunglasses"}, {value: "Raccoon", label: "Raccoon"}, {value: "Glasses", label: "Glasses"},
  {value: "Kitchen knife", label: "Kitchen knife"}, {value: "Roller skates", label: "Roller skates"}, {value: "Microphone", label: "Microphone"}, 
  {value: "Alarm clock", label: "Alarm clock"}, {value: "Sewing machine", label: "Sewing machine"}, {value: "Footwear", label: "Footwear"}, 
  {value: "Goggles", label: "Goggles"}, {value: "Cream", label: "Cream"}, {value: "Mixing bowl", label: "Mixing bowl"}, {value: "Tomato", label: "Tomato"}, 
  {value: "Wok", label: "Wok"}, {value: "Teapot", label: "Teapot"}, {value: "Flowerpot", label: "Flowerpot"}, {value: "Printer", label: "Printer"}, 
  {value: "Sports uniform", label: "Sports uniform"}, {value: "Flag", label: "Flag"}, {value: "Plastic bag", label: "Plastic bag"}, {value: "Sports equipment", label: "Sports equipment"}, 
  {value: "Hedgehog", label: "Hedgehog"}, {value: "Tart", label: "Tart"}, {value: "Musical keyboard", label: "Musical keyboard"}, {value: "Table tennis racket", label: "Table tennis racket"},
  {value: "Crown", label: "Crown"}, {value: "Fire hydrant", label: "Fire hydrant"}, {value: "Sink", label: "Sink"}, {value: "Diaper", label: "Diaper"}, {value: "Giraffe", label: "Giraffe"},
  {value: "Treadmill", label: "Treadmill"}, {value: "Snail", label: "Snail"}, {value: "Human foot", label: "Human foot"}, {value: "Home appliance", label: "Home appliance"},
  {value: "Monkey", label: "Monkey"}, {value: "Glove", label: "Glove"}, {value: "Refrigerator", label: "Refrigerator"}, {value: "Headphones", label: "Headphones"}, 
  {value: "Mug", label: "Mug"}, {value: "Canoe", label: "Canoe"}, {value: "Marine invertebrates", label: "Marine invertebrates"}, {value: "Doughnut", label: "Doughnut"},
  {value: "Deer", label: "Deer"}, {value: "Axe", label: "Axe"}, {value: "Person", label: "Person"}, {value: "Remote control", label: "Remote control"},
  {value: "Traffic sign", label: "Traffic sign"}, {value: "Cucumber", label: "Cucumber"}, {value: "Vegetable", label: "Vegetable"}, {value: "Cake", label: "Cake"},
  {value: "Rays and skates", label: "Rays and skates"}, {value: "Ice cream", label: "Ice cream"}, {value: "Snack", label: "Snack"}, {value: "Violin", label: "Violin"},
  {value: "Fireplace", label: "Fireplace"}, {value: "Milk", label: "Milk"}, {value: "Horse", label: "Horse"}, {value: "Tableware", label: "Tableware"}, 
  {value: "Filing cabinet", label: "Filing cabinet"}, {value: "Watercraft", label: "Watercraft"}, {value: "Hamburger", label: "Hamburger"}, {value: "Fast food", label: "Fast food"},
  {value: "Sea lion", label: "Sea lion"}, {value: "Human hair", label: "Human hair"}, {value: "Jellyfish", label: "Jellyfish"}, {value: "Power plugs and sockets", label: "Power plugs and sockets"},
  {value: "Wrench", label: "Wrench"}, {value: "Sheep", label: "Sheep"}, {value: "Lamp", label: "Lamp"}, {value: "Barge", label: "Barge"}, {value: "Wine rack", label: "Wine rack"}, 
  {value: "Washing machine", label: "Washing machine"}, {value: "Pineapple", label: "Pineapple"}, {value: "Invertebrate", label: "Invertebrate"}, {value: "Mouse", label: "Mouse"}, 
  {value: "Platter", label: "Platter"}, {value: "Bowling equipment", label: "Bowling equipment"}, {value: "Dagger", label: "Dagger"}, {value: "Shellfish", label: "Shellfish"}, 
  {value: "Stairs", label: "Stairs"}, {value: "Toilet", label: "Toilet"}, {value: "Flower", label: "Flower"}, {value: "Tie", label: "Tie"}, {value: "Bus", label: "Bus"}, 
  {value: "Marine mammal", label: "Marine mammal"}, {value: "Parking meter", label: "Parking meter"}, {value: "Car", label: "Car"}, {value: "Jeans", label: "Jeans"},
  {value: "Sun hat", label: "Sun hat"}, {value: "Sea turtle", label: "Sea turtle"}, {value: "Dumbbell", label: "Dumbbell"}, {value: "Bell pepper", label: "Bell pepper"},
  {value: "Screwdriver", label: "Screwdriver"}, {value: "Lipstick", label: "Lipstick"}, {value: "Corded phone", label: "Corded phone"}, {value: "Moths and butterflies", label: "Moths and butterflies"},
  {value: "Tea", label: "Tea"}, {value: "Truck", label: "Truck"}, {value: "Golf cart", label: "Golf cart"}, {value: "Curtain", label: "Curtain"}, {value: "Spider", label: "Spider"},
  {value: "Shirt", label: "Shirt"}, {value: "Waste container", label: "Waste container"}, {value: "Lobster", label: "Lobster"}, {value: "Human mouth", label: "Human mouth"}, 
  {value: "Surfboard", label: "Surfboard"}, {value: "Clock", label: "Clock"}, {value: "Mule", label: "Mule"}, {value: "Lily", label: "Lily"}, {value: "Human nose", label: "Human nose"},
  {value: "Coffee cup", label: "Coffee cup"}, {value: "Falcon", label: "Falcon"}, {value: "Fox", label: "Fox"}, {value: "Bull", label: "Bull"}, {value: "Mechanical fan", label: "Mechanical fan"},
  {value: "Unicycle", label: "Unicycle"}, {value: "Skull", label: "Skull"}, {value: "Microwave oven", label: "Microwave oven"}, {value: "Tortoise", label: "Tortoise"}, 
  {value: "Parachute", label: "Parachute"}, {value: "Stationary bicycle", label: "Stationary bicycle"}, {value: "Pumpkin", label: "Pumpkin"}, {value: "Turkey", label: "Turkey"}, 
  {value: "Kangaroo", label: "Kangaroo"}, {value: "Dessert", label: "Dessert"}, {value: "Fashion accessory", label: "Fashion accessory"}, {value: "Helmet", label: "Helmet"}, 
  {value: "Oven", label: "Oven"}, {value: "Toilet paper", label: "Toilet paper"}, {value: "Snowplow", label: "Snowplow"}, {value: "Potato", label: "Potato"}, {value: "Vase", label: "Vase"}, 
  {value: "Cosmetics", label: "Cosmetics"}, {value: "Beehive", label: "Beehive"}, {value: "Book", label: "Book"}, {value: "Harp", label: "Harp"}, {value: "Binoculars", label: "Binoculars"}, 
  {value: "Bat", label: "Bat"}, {value: "Jaguar", label: "Jaguar"}, {value: "Sushi", label: "Sushi"}, {value: "Chainsaw", label: "Chainsaw"}, {value: "Bowl", label: "Bowl"}, 
  {value: "Baked goods", label: "Baked goods"}, {value: "Boot", label: "Boot"}, {value: "Barrel", label: "Barrel"}, {value: "Saucer", label: "Saucer"}, {value: "Hiking equipment", label: "Hiking equipment"}, 
  {value: "Ant", label: "Ant"}, {value: "Skateboard", label: "Skateboard"}, {value: "Reptile", label: "Reptile"}, {value: "Goat", label: "Goat"}, {value: "Light bulb", label: "Light bulb"},
  {value: "Caterpillar", label: "Caterpillar"}, {value: "Taxi", label: "Taxi"}, {value: "Salad", label: "Salad"}, {value: "Closet", label: "Closet"}, {value: "Frog", label: "Frog"}, {value: "Crab", label: "Crab"}, 
  {value: "Christmas tree", label: "Christmas tree"}, {value: "Duck", label: "Duck"}, {value: "Dinosaur", label: "Dinosaur"}, {value: "Tower", label: "Tower"}, {value: "Coffee table", label: "Coffee table"}, 
  {value: "Wardrobe", label: "Wardrobe"}, {value: "Tennis racket", label: "Tennis racket"}, {value: "Chest of drawers", label: "Chest of drawers"}, {value: "Bee", label: "Bee"}, {value: "Apple", label: "Apple"},
  {value: "Worm", label: "Worm"}, {value: "Muffin", label: "Muffin"}, {value: "Skyscraper", label: "Skyscraper"}, {value: "Jug", label: "Jug"}, {value: "Harbor seal", label: "Harbor seal"},
  {value: "Tree", label: "Tree"}, {value: "Vehicle", label: "Vehicle"}, {value: "Stool", label: "Stool"}, {value: "Waffle", label: "Waffle"}, {value: "Billboard", label: "Billboard"}, 
  {value: "Rhinoceros", label: "Rhinoceros"}, {value: "Cocktail", label: "Cocktail"}, {value: "Seafood", label: "Seafood"}, {value: "Bathtub", label: "Bathtub"},
  {value: "Computer mouse", label: "Computer mouse"}, {value: "Carnivore", label: "Carnivore"}, {value: "Sock", label: "Sock"}, {value: "Ski", label: "Ski"},
  {value: "Zebra", label: "Zebra"}, {value: "Fountain", label: "Fountain"}, {value: "Woodpecker", label: "Woodpecker"}, {value: "Pizza", label: "Pizza"}, 
  {value: "Bed", label: "Bed"}, {value: "Window blind", label: "Window blind"}, {value: "Bidet", label: "Bidet"}, {value: "Tiger", label: "Tiger"}, 
  {value: "Miniskirt", label: "Miniskirt"}, {value: "Perfume", label: "Perfume"}, {value: "Lizard", label: "Lizard"}, {value: "Sword", label: "Sword"}, 
  {value: "Pen", label: "Pen"}, {value: "Dairy", label: "Dairy"}, {value: "Bicycle wheel", label: "Bicycle wheel"}]


  
    const contextValue = {
        Video_keyframe, 
        setVideoKeyframe,
        datasub,
        setDatasub,
        options,
        VideoList,
        setVideoList,
        VideoListObject,
        setVideoListObject,
        startPoint,
        setStartPoint,
        endPoint,
        setEndPoint,
        keyframeKnn,
        setKeyframeKnn,
        dataKNN,
        setDataKNN,
        knn,
        setKnn,
        submit,
        setSubmit,
        flag,
        setFlag,

    };
  
    return (
      <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
    );
  };
  
  export const useData = () => useContext(DataContext)
  