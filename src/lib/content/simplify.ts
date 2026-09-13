export interface SimplifiedExplanation {
  analogy: string;
  everyday: string;
  easierNumbers: string;
  smallSteps: string[];
}

// A DIFFERENT, simpler re-explanation for the "I DON'T UNDERSTAND" button —
// never just a repeat of the main lesson text.
export const SIMPLIFIED: Record<string, SimplifiedExplanation> = {
  "quantities-units": {
    analogy: "Think of units like currency. You can't add Ugandan shillings directly to US dollars without converting first — same with mixing km and m.",
    everyday: "If your friend tells you a boda ride took '2000 metres' and another took '3 km', you must convert both to the same unit before comparing who travelled further.",
    easierNumbers: "Instead of 90 km/h, imagine just 'walking 1 metre every second' — that's already in SI units, no conversion needed.",
    smallSteps: ["Write down the unit you're given.", "Write down the unit you need.", "Find the one multiplying/dividing factor between them.", "Apply it to the number only."],
  },
  vectors: {
    analogy: "A vector is like giving someone directions: 'walk 5 steps' is not enough — you must also say 'to the North'. The number alone (5) is the scalar; adding direction makes it a vector.",
    everyday: "If you push a shopping trolley forward and slightly sideways, part of your push moves it forward and part pushes it sideways — that's resolving one push into two simpler pushes.",
    easierNumbers: "Instead of an angle like 37°, imagine pushing exactly diagonally (45°) — then the forward and sideways pushes are exactly equal.",
    smallSteps: ["Draw the vector as an arrow.", "Draw a horizontal line and vertical line from its tail.", "Drop a line from the tip to complete a right-angled triangle.", "Use cos for the side touching the angle, sin for the side opposite it."],
  },
  "kinematics-basics": {
    analogy: "Distance is like the total steps your fitness tracker counts; displacement is like a straight arrow drawn from your house to wherever you ended up.",
    everyday: "If you go to a shop and come straight back home, your tracker shows steps (distance) but you're back exactly where you started (zero displacement).",
    easierNumbers: "Walk 10 m forward, then 10 m back: distance = 20 m, displacement = 0 m — easy to check because the numbers are equal and opposite.",
    smallSteps: ["List every leg of the journey and its length.", "Add ALL lengths for distance.", "Draw start and end points; measure the straight line between them for displacement."],
  },
  suvat: {
    analogy: "Think of the SUVAT equations like different keys for different locks — each equation is the 'right key' when you know a particular set of 3 things and want a 4th.",
    everyday: "A boda boda speeding up steadily is exactly like a car accelerating in these equations — as long as the speeding-up is smooth and constant, SUVAT works.",
    easierNumbers: "Instead of decimals, imagine u=0, a=2 m/s², t=5s: v = 0 + 2×5 = 10 m/s — easy round numbers to see the pattern.",
    smallSteps: ["Write down u, v, a, s, t and mark which ones you know.", "Find the equation missing only the ONE unknown you don't know.", "Substitute the numbers.", "Solve step-by-step, keeping units."],
  },
  "motion-graphs": {
    analogy: "A graph's slope is like a hill's steepness — the steeper it is, the faster the quantity is changing.",
    everyday: "If you record your walking speed every few seconds and plot it, a flat line means constant speed, while a rising line means you're speeding up.",
    easierNumbers: "A straight line going from (0,0) to (2,10) has a slope of 10/2 = 5 — just rise divided by run.",
    smallSteps: ["Identify which two axes are plotted.", "For gradient: pick two points, find the change in y and change in x.", "Divide change in y by change in x.", "For area: split the shape into simple triangles/rectangles."],
  },
  projectiles: {
    analogy: "Imagine dropping a ball from your hand (falls straight down) at the SAME time as rolling a ball off a table (falls down AND moves forward) — they hit the ground at exactly the same TIME, because gravity affects their downward motion identically.",
    everyday: "When a footballer kicks a ball high and far, gravity is pulling it down the whole time, even while it keeps sailing forward — like two invisible hands working independently.",
    easierNumbers: "Instead of an angle, imagine throwing something straight up (90°) — all the motion is vertical, easy to picture with normal SUVAT.",
    smallSteps: ["Split the initial velocity into horizontal (u cosθ) and vertical (u sinθ) parts.", "Treat vertical motion like a normal 'thrown up' SUVAT problem.", "Treat horizontal motion as constant speed.", "Use time as the link between the two."],
  },
  "newton-laws": {
    analogy: "Newton's laws are like the rules of a tug-of-war: nothing moves until the pulling is unbalanced (1st law); the bigger the net pull, the faster things speed up for a given team size/weight (2nd law); and if you pull the rope, the rope pulls back on you just as hard (3rd law).",
    everyday: "A stationary shopping trolley won't move by itself — someone must push it. A loaded trolley is harder to speed up than an empty one for the same push.",
    easierNumbers: "Instead of decimals, imagine a 1 kg object needing a 1 N force to get 1 m/s² acceleration — the simplest possible numbers, straight from F=ma.",
    smallSteps: ["List every force on the object.", "Add them up as vectors to get the resultant.", "Apply F(resultant) = ma.", "Solve for the requested unknown."],
  },
  friction: {
    analogy: "Friction is like a stubborn friend holding a rope — they'll resist being pulled up to a point, but push hard enough and they finally let go and you both go sliding.",
    everyday: "Trying to push a heavy sofa across a rough carpet — nothing happens until you push hard enough, then it suddenly slides.",
    easierNumbers: "Imagine μ = 0.5 exactly: this means the maximum friction force is exactly half of the normal reaction force — an easy fraction to picture.",
    smallSteps: ["Find the Normal reaction N first.", "Multiply by μ to get maximum available friction.", "Compare to the force trying to cause sliding.", "If the driving force is bigger, motion happens; if smaller or equal, it stays still."],
  },
  "free-body-diagrams": {
    analogy: "A free body diagram is like a passport photo of just ONE object, showing only the arrows (forces) pulling or pushing on it — nothing else in the picture.",
    everyday: "Picture a mango hanging from a tree by its stem: only two forces act on it — gravity pulling it down, and the stem pulling it up. That's a complete FBD.",
    easierNumbers: "For an object just sitting still, remember there are usually only 2-3 forces at most to draw — don't overcomplicate it.",
    smallSteps: ["Draw a dot or box for the object.", "Add an arrow straight down for weight (always present).", "Add an arrow for any surface touching it (normal reaction).", "Add arrows for any strings, applied pushes, or friction."],
  },
  "momentum-impulse": {
    analogy: "Momentum conservation is like sharing sweets: however the sweets get redistributed between two friends, the TOTAL number of sweets stays the same, unless someone from outside adds or removes some.",
    everyday: "Two boda bodas colliding is like two people bumping into each other while carrying heavy bags — their combined 'push effect' before the bump equals their combined push effect right after.",
    easierNumbers: "Imagine equal masses: a 1 kg ball at 4 m/s hits an identical stationary 1 kg ball and they stick — together they must move at 2 m/s (sharing the original momentum equally).",
    smallSteps: ["Write total momentum before (add up each mass × velocity, with signs for direction).", "Write total momentum after, using unknowns.", "Set them equal.", "Solve for the unknown."],
  },
  "work-energy-power": {
    analogy: "Energy is like money in your pocket: it can change form (buying food, saving it, giving it away) but the total amount you started with, plus what you earn, never magically increases from nothing.",
    everyday: "Climbing stairs converts your body's chemical energy into gravitational potential energy — the higher you climb, the more energy you've 'stored' due to height.",
    easierNumbers: "Instead of decimals, imagine a 1 kg mass lifted 1 m with g=10: GPE = 1×10×1 = 10 J — simple whole numbers to see the pattern.",
    smallSteps: ["Identify what type of energy is changing (KE, GPE, elastic PE).", "Write the relevant formula for each type.", "Use conservation: energy lost in one form = energy gained in another (plus losses).", "Solve for the unknown quantity."],
  },
  "circular-motion": {
    analogy: "Swinging a bucket of water in a circle: your arm constantly pulls the bucket INWARD (toward you) — without that inward pull, the bucket would fly off in a straight line, not stay circling.",
    everyday: "A car going round a roundabout needs grip (friction) pulling it toward the centre of the roundabout — too fast, and it runs out of grip and skids outward.",
    easierNumbers: "Imagine r=1m and v=1m/s: a=v²/r=1 m/s² — the simplest possible circular motion numbers.",
    smallSteps: ["Identify what provides the inward force (friction, tension, gravity).", "Use F = mv²/r or a = v²/r directly.", "Remember this F is not an 'extra' force — it's the resultant of real forces already present."],
  },
  "gravitation-fields": {
    analogy: "Gravity is like an invisible elastic band connecting every two masses in the universe, always pulling them together, weaker the further apart they stretch.",
    everyday: "The Moon doesn't fall into the Earth because it's also moving sideways fast enough that as it 'falls', it also 'moves past' — perpetually falling around Earth instead of into it.",
    easierNumbers: "Imagine doubling the distance between two masses: the force becomes 4 times weaker (inverse square), not just half.",
    smallSteps: ["Identify the two masses and distance between their centres.", "Use F=Gm1m2/r² for force, or g=GM/r² for field strength at a point.", "For orbits, set gravity equal to the required centripetal force and solve."],
  },
  "moments-equilibrium": {
    analogy: "A moment is like using a long stick to lift a rock — the longer the stick (further from the pivot), the less force you personally need to apply.",
    everyday: "A door is easiest to push open near the handle (far from the hinge) and hardest to push open right next to the hinge.",
    easierNumbers: "Imagine a see-saw with equal weights: they must sit at EQUAL distances from the pivot to balance — the simplest case to picture.",
    smallSteps: ["Choose a pivot point.", "Multiply each force by its perpendicular distance from that pivot.", "Add up all clockwise-turning ones, and separately all anticlockwise ones.", "Set them equal for balance and solve."],
  },
  "shm-oscillations": {
    analogy: "SHM is like a naughty child being pulled back to their mother every time they wander off — the further they wander, the harder the pull back toward her.",
    everyday: "A child on a swing always feels a push back toward the centre — stronger the higher they swing, weaker right at the bottom.",
    easierNumbers: "Imagine ω=1 rad/s and x=1m: acceleration = -1×1×1 = -1 m/s² — an easy way to see 'proportional and opposite'.",
    smallSteps: ["Identify the restoring force (spring or gravity component).", "Match it to F=ma to find ω².", "Use T=2π/ω to find the period.", "Remember velocity is greatest at the centre, zero at the extremes (opposite for acceleration)."],
  },
  "elasticity-hooke": {
    analogy: "Stretching a spring gently is like gently pulling dough — up to a point it 'remembers' its shape and springs back; pull too far, and it stays stretched or tears.",
    everyday: "A rubber band stretched a little snaps back perfectly; stretched too far, it either stays loose and floppy or snaps completely.",
    easierNumbers: "Imagine k=10 N/m and x=1m: F=10 N — nice round numbers showing force is directly proportional to extension.",
    smallSteps: ["Check whether you're below the elastic limit (Hooke's Law applies).", "Use F=kx for force/extension relationships.", "Use E=½kx² for energy stored, remembering it's the AREA under the graph."],
  },
};

export function getSimplified(topicId: string): SimplifiedExplanation | undefined {
  return SIMPLIFIED[topicId];
}
