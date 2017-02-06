const files = [
    { name: "recipes.md", contents: `
  ## wok dish

  Rice noodles
  This shaved carrot
  Fresh crisp greens
  Dried mushrooms rehydrated in salt water
  Topped with diced cilantro and dried crisp onion
  Chicken pieces
  White sauce, mild
  Ginger

  ## oven

  Chicken breasts on top of mashed potatoes under apple slices.
  Topped with Cambert/Brie and balsamic glaze. Baked.`
    },
    { name: "RV Upgrades.md", contents: `
  Meant to help me think about long-term goals, prioritization, and effort.

  Eventually I can add plan specifics, estimate effort, and so on.

  Many of these were moved to a spreadsheet to estimate cost and effort: https://docs.google.com/spreadsheets/d/17bFoC4n-pjU-owbrjREoF5Lnfu6ZpYajDTr3l87tDBQ/edit#gid=0

  * Fun: Great sound system (rear speakers, light subwoofer)
  * Work: Great workstation comfortable chair, desk, and large monitor(s)
  * Windows: replace curtains w/ better light/heat blocking and easy to deploy thing

  * Security: exterior camera system w/ monitor
  * Security: Safe bolted to the floor that can hold 2 laptops
  * Security: motion detecting exterior lights

  * Cooking: Great 12v fridge
  * Cooking: Exhaust fan

  * Clothing: external drying rack (dry clothes while driving down the road)

  * Boondocking: Gray water switch valve (so I can go to ground with it)
  * Boondocking: Composting toilet

  * Cosmetic: Replace flooring with something beautiful and durable + soft area rug
  * Cosmetic: Replace ceiling with something awesome like hammered tin or gold foil
  * Cosmetic: Replace cabinetry with something modern, sliding doors, lightweight

  * Shower: Shower-Tub that allows you to sit in it for ease in the small space
  * Shower: Oxygenics (low flow high pressure) shower head

  * Climate: Roof Fans that turn on when temp is over T
  * Climate: Heater that turns on when temp is below T

  * Electric: Larger battery capacity, lots of solar, converter
  * Electric: LED lights everywhere
  * Electric: Shore power input and designated outlet in the van

`   },
    { name: "Studying CS and JS Fundamentals.md", contents: `
o Review C's codebase. Remind myself what it's like to do these things in a large app:
  o write a test
  o depend on other objects
  o Do something complicated and non-visual

o deep: omaha low https://community.topcoder.com/stat?c=problem_statement&pm=2435&rd=5852
o deep: 1994 MS interview question: draw a circle -- do it faster (symmetry), no sin/cos (sqrt), no sqrt (!) "bresenham's algo"
o deep: do a js visualization of k-means. https://en.wikipedia.org/wiki/K-means_clustering
  o Represent positions on a screen
  o represent polygons that draw the grouping
`   },
    { name: "_To Do.md", contents: `
x Setting Up a Productive React Development Environment
	x add Emmet to atom -- https://gist.github.com/mxstbr/361ddb22057f0a01762240be209321f0
	get emmet and language-babel packages
	add to keymap:
	'atom-text-editor[data-grammar~="jsx"]:not([mini])':
	  'tab': 'emmet:expand-abbreviation-with-tab'
	x get sass going
		npm install -g node-sass
		get the atom plugin
	o add eslint to atom
---
o Continue Abramov's redux course on https://egghead.io

x Make a react app that displays a list of selectable files, show detail when you select
	x List of fake data files
	x interactive file names
	x when a file is clicked, provide that object to a parent component
	x Show file details on click and have a back link
    `
    }
]
export default files;
