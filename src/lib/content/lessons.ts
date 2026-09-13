import type { Lesson } from "@/lib/types";

export const LESSONS: Lesson[] = [
  {
    topicId: "quantities-units",
    simpleExplanation:
      "Physics measures the world using quantities. Some are 'basic building blocks' (base quantities) and others are built by combining them (derived quantities). We measure everything using an agreed language: the SI (International System) units.",
    definition:
      "A physical quantity is anything that can be measured and expressed as a number multiplied by a unit. Base quantities (mass, length, time, current, temperature, amount of substance, luminous intensity) cannot be broken down further. Derived quantities (e.g. velocity, force, energy) are combinations of base quantities.",
    realLifeExplanation:
      "When a boda boda rider says 'I travelled 40 km in half an hour', they are using derived quantities (distance in km, time in hours) to describe motion. Engineers building the Kampala flyover must use exact SI units so that every calculation, from every country, means the same thing.",
    formulaIds: ["dimension-check", "unit-conversion"],
    derivation: [
      "Speed is defined as distance moved per unit time: speed = distance / time.",
      "Distance has the dimension of length [L]; time has the dimension [T].",
      "Therefore speed has dimensions [L][T]^-1, which is why its SI unit is m/s (metres per second).",
      "This dimensional reasoning lets us check whether an equation could possibly be correct before we even substitute numbers.",
    ],
    workedExamples: [
      {
        title: "Converting km/h to m/s",
        solution: {
          given: ["A car travels at 90 km/h"],
          find: "The speed in m/s",
          principle: "1 km = 1000 m and 1 hour = 3600 s, so we convert both units consistently.",
          formula: "speed (m/s) = speed (km/h) × 1000 / 3600 = speed (km/h) / 3.6",
          whyFormula: "Multiplying by 1000 converts km to m; dividing by 3600 converts hours to seconds. Doing both together gives the shortcut ÷3.6.",
          substitution: "speed = 90 / 3.6",
          calculation: ["90 / 3.6 = 25"],
          units: "m/s (metres per second)",
          finalAnswer: "25 m/s",
          meaning: "A car at 90 km/h covers 25 metres every second — about two car-lengths per second.",
        },
      },
    ],
    commonMistakes: [
      "Forgetting to convert units before substituting into a formula.",
      "Confusing km/h and m/s conversion factor (multiply vs divide by 3.6).",
      "Mixing grams and kilograms in the same calculation.",
    ],
    summary: [
      "Base quantities: mass (kg), length (m), time (s), current (A), temperature (K), amount of substance (mol), luminous intensity (cd).",
      "Derived quantities are combinations of base quantities, e.g. velocity = length/time.",
      "Always convert to consistent SI units before calculating.",
      "Dimensional analysis can check if an equation is physically possible.",
    ],
  },
  {
    topicId: "vectors",
    simpleExplanation:
      "A scalar only has a size (magnitude). A vector has both a size AND a direction. Walking 5 km is a scalar (distance); walking 5 km due North is a vector (displacement).",
    definition:
      "A scalar quantity is fully described by magnitude alone (e.g. mass, distance, speed, energy, time). A vector quantity requires both magnitude and direction (e.g. displacement, velocity, acceleration, force, momentum).",
    realLifeExplanation:
      "A pilot flying from Entebbe must know not just how fast to fly (speed) but which direction (bearing) — that combination is a velocity vector. If wind pushes the plane sideways, the pilot must add the wind vector to the intended velocity vector to find the actual path over the ground.",
    formulaIds: ["vector-resultant", "vector-components"],
    derivation: [
      "Consider a vector of magnitude V at angle θ measured from the horizontal (x-axis).",
      "Drop a perpendicular from the tip of the vector onto the x-axis to form a right-angled triangle.",
      "The adjacent side is the horizontal component: Vx = V cos θ.",
      "The opposite side is the vertical component: Vy = V sin θ.",
      "By Pythagoras, the magnitude can be recovered: V = √(Vx² + Vy²), and the direction from tan θ = Vy / Vx.",
    ],
    workedExamples: [
      {
        title: "Resolving a force into components",
        solution: {
          given: ["A rope pulls a sled with force F = 120 N", "The rope makes 30° with the horizontal ground"],
          find: "The horizontal and vertical components of the force",
          principle: "Any vector can be resolved into two perpendicular components using trigonometry.",
          formula: "Fx = F cos θ, Fy = F sin θ",
          whyFormula: "The force and its components form a right-angled triangle where F is the hypotenuse; cosine gives the side adjacent to θ (horizontal) and sine gives the side opposite θ (vertical).",
          substitution: "Fx = 120 cos 30°, Fy = 120 sin 30°",
          calculation: ["cos 30° = 0.866, so Fx = 120 × 0.866 = 103.9 N", "sin 30° = 0.5, so Fy = 120 × 0.5 = 60 N"],
          units: "N (newtons)",
          finalAnswer: "Fx ≈ 103.9 N, Fy = 60 N",
          meaning: "Only 103.9 N actually pulls the sled forward along the ground; the other 60 N tries to lift it upward, reducing its effective weight on the ground.",
        },
      },
    ],
    commonMistakes: [
      "Using sine when cosine is needed (or vice versa) — always identify which side is adjacent/opposite to the given angle.",
      "Adding vector magnitudes directly without considering direction (e.g. 3 N + 4 N is NOT always 7 N).",
      "Forgetting that components in opposite directions must be subtracted, not added.",
      "Leaving an answer without stating direction, when direction was requested.",
    ],
    summary: [
      "Scalars: magnitude only. Vectors: magnitude + direction.",
      "Resultant = the single vector equivalent to two or more combined vectors.",
      "Resolve a vector into perpendicular (usually horizontal/vertical) components using cos and sin.",
      "An object is in equilibrium when the vector sum of all forces is zero.",
    ],
    simulationId: "vector-simulator",
  },
  {
    topicId: "kinematics-basics",
    simpleExplanation:
      "Distance is how far you actually travelled (a scalar). Displacement is how far you ended up from where you started, in a straight line, with direction (a vector). Speed tells you how fast distance is covered; velocity tells you how fast displacement changes.",
    definition:
      "Distance: total length of the path travelled by a body, regardless of direction. Displacement: the change in position of a body, i.e. shortest straight-line distance from initial to final position, in a specified direction. Speed = distance/time (scalar). Velocity = displacement/time (vector).",
    realLifeExplanation:
      "A student runs one full lap of a 400 m school track and returns to the starting point. The distance covered is 400 m, but the displacement is 0 m, because they ended up exactly where they started! Their average speed is not zero, but their average velocity IS zero.",
    formulaIds: ["avg-speed", "avg-velocity"],
    workedExamples: [
      {
        title: "Distance vs displacement on a running track",
        solution: {
          given: ["A student runs 3/4 of a way around a circular track of radius 50 m", "Time taken = 90 s"],
          find: "Average speed and average velocity",
          principle: "Speed uses total path length (distance); velocity uses the straight-line change in position (displacement) and direction.",
          formula: "speed = distance / time; velocity = displacement / time",
          whyFormula: "These are the defining formulas — distance and displacement measure different things, so dividing each by the same time gives two genuinely different quantities.",
          substitution: "Distance = 3/4 × 2πr = 0.75 × 2π × 50; Displacement = straight line from start to 3/4 point = r√2 (since 3/4 of a circle leaves a 90° chord)",
          calculation: [
            "Distance = 0.75 × 2 × 3.142 × 50 = 235.6 m",
            "speed = 235.6 / 90 = 2.62 m/s",
            "Displacement = 50√2 = 70.7 m (straight line, at 45° to the start radius)",
            "velocity = 70.7 / 90 = 0.79 m/s in that direction",
          ],
          units: "m/s",
          finalAnswer: "average speed ≈ 2.62 m/s; average velocity ≈ 0.79 m/s (directed along the chord)",
          meaning: "Even though the runner moved quite fast along the track, their overall progress away from the start (velocity) is much smaller because most of the running 'wrapped around' rather than moving them further away.",
        },
      },
    ],
    commonMistakes: [
      "Treating distance and displacement as always equal (only true for straight-line motion in one direction).",
      "Reporting velocity without direction.",
      "Confusing 'average speed' (total distance / total time) with the average of individual speeds.",
    ],
    summary: [
      "Distance & speed are scalars; displacement & velocity are vectors.",
      "Average velocity can be zero even if the body was moving the whole time (round trip).",
      "Instantaneous velocity = velocity at one particular moment (gradient of displacement-time graph at a point).",
    ],
  },
  {
    topicId: "suvat",
    simpleExplanation:
      "When acceleration is constant, five quantities (u, v, a, s, t) are all linked by four key equations. If you know any three, you can find the other two.",
    definition:
      "The SUVAT equations relate displacement (s), initial velocity (u), final velocity (v), acceleration (a) and time (t) for motion with CONSTANT (uniform) acceleration only.",
    realLifeExplanation:
      "When a car brakes to a stop at a constant deceleration, or a stone is dropped and speeds up steadily under gravity, the SUVAT equations let engineers and physicists predict stopping distances, fall times, and speeds without needing calculus every time.",
    formulaIds: ["suvat-v-u-at", "suvat-s-ut-half-at2", "suvat-v2-u2-2as", "suvat-s-avg"],
    derivation: [
      "Start from the definition of acceleration: a = (v − u) / t. Rearranged: v = u + at.  [Equation 1]",
      "Displacement equals average velocity × time. For uniform acceleration, average velocity = (u + v)/2, so s = ((u+v)/2) × t. [Equation 2]",
      "Substitute v = u + at into Equation 2: s = ((u + u + at)/2) × t = ut + ½at². [Equation 3]",
      "To eliminate time: from Equation 1, t = (v − u)/a. Substitute into Equation 2: s = ((u+v)/2) × (v−u)/a = (v² − u²)/(2a). Rearranged: v² = u² + 2as. [Equation 4]",
    ],
    workedExamples: [
      {
        title: "A car accelerating from rest",
        solution: {
          given: ["Initial velocity u = 0 m/s (starts from rest)", "Acceleration a = 3 m/s²", "Time t = 8 s"],
          find: "Final velocity v and distance travelled s",
          principle: "Motion with constant acceleration is governed by the SUVAT equations.",
          formula: "v = u + at  and  s = ut + ½at²",
          whyFormula: "We are given u, a, t and need v and s — these two equations use exactly those variables directly, with no need to find an intermediate unknown first.",
          substitution: "v = 0 + 3(8);  s = 0(8) + ½(3)(8²)",
          calculation: ["v = 24 m/s", "s = 0 + 0.5 × 3 × 64 = 96 m"],
          units: "v in m/s, s in m",
          finalAnswer: "v = 24 m/s, s = 96 m",
          meaning: "After 8 seconds of steady acceleration, the car is moving at 24 m/s (86.4 km/h) and has covered 96 m — a little less than a football pitch.",
        },
      },
    ],
    commonMistakes: [
      "Using SUVAT when acceleration is NOT constant (e.g. with air resistance that changes, or varying force) — SUVAT only works for uniform acceleration.",
      "Mixing up u (initial) and v (final) velocity.",
      "Forgetting to assign a negative sign to deceleration or to gravity when direction matters.",
      "Using the wrong SUVAT equation when a simpler one (matching the known variables) is available.",
    ],
    summary: [
      "v = u + at", "s = ut + ½at²", "v² = u² + 2as", "s = ((u+v)/2)t",
      "Only valid when acceleration is constant.",
      "Always define a positive direction first, especially for vertical motion under gravity.",
    ],
    simulationId: "suvat-explorer",
  },
  {
    topicId: "motion-graphs",
    simpleExplanation:
      "Graphs are a picture of motion. The slope (gradient) tells you a rate, and the area underneath tells you a total amount.",
    definition:
      "On a displacement-time graph, gradient = velocity. On a velocity-time graph, gradient = acceleration, and the area between the line and the time-axis = displacement. On an acceleration-time graph, area = change in velocity.",
    realLifeExplanation:
      "A speed camera graph of a car's journey along Jinja road shows flat sections (parked/stationary), rising slopes (accelerating), and sudden negative slopes (braking). Traffic police can read a car's behaviour directly from the shape of its motion graph.",
    formulaIds: ["gradient-graph", "area-under-graph"],
    workedExamples: [
      {
        title: "Reading a velocity-time graph",
        solution: {
          given: ["A velocity-time graph shows velocity rising in a straight line from 0 to 20 m/s over 5 s, then constant at 20 m/s for the next 10 s"],
          find: "The acceleration in the first phase and the total distance travelled",
          principle: "Gradient of a v-t graph = acceleration. Area under a v-t graph = distance.",
          formula: "a = Δv/Δt; distance = area of triangle + area of rectangle",
          whyFormula: "The v-t graph directly encodes acceleration as its slope and distance as the enclosed area — this is the geometric meaning of the calculus definitions.",
          substitution: "a = (20 − 0)/(5 − 0); Area₁ = ½ × 5 × 20; Area₂ = 10 × 20",
          calculation: ["a = 20/5 = 4 m/s²", "Area₁ (triangle) = ½ × 5 × 20 = 50 m", "Area₂ (rectangle) = 10 × 20 = 200 m", "Total distance = 50 + 200 = 250 m"],
          units: "a in m/s², distance in m",
          finalAnswer: "acceleration = 4 m/s²; total distance = 250 m",
          meaning: "The object sped up steadily for 5 seconds reaching 20 m/s, then cruised at that constant speed, covering 250 m altogether.",
        },
      },
    ],
    commonMistakes: [
      "Confusing a displacement-time graph with a velocity-time graph — the meaning of gradient and area is different for each.",
      "Calculating area under a displacement-time graph (this has no standard physical meaning at this level).",
      "Forgetting that area BELOW the time-axis represents negative (backward) displacement, and should be subtracted.",
      "Treating a curved graph as if the gradient were constant.",
    ],
    summary: [
      "Displacement-time graph gradient = velocity.",
      "Velocity-time graph gradient = acceleration; area = displacement.",
      "Acceleration-time graph area = change in velocity.",
      "A curved line means changing rate — use a tangent for instantaneous values.",
    ],
    simulationId: "graph-trainer",
  },
  {
    topicId: "projectiles",
    simpleExplanation:
      "A projectile moves under gravity alone once launched. Its horizontal motion (constant velocity) and vertical motion (constant acceleration g) are totally independent of each other — they only share the same time.",
    definition:
      "Projectile motion is the two-dimensional motion of an object launched into the air, experiencing constant vertical acceleration due to gravity (g) and (ignoring air resistance) zero horizontal acceleration.",
    realLifeExplanation:
      "When a footballer kicks a ball to score, or a boda boda jumps a ramp, or a basketball is launched at the hoop, gravity pulls the object downward the entire time while it continues moving forward at a constant horizontal speed — this is why the path traced is a curve (parabola).",
    formulaIds: ["projectile-time-of-flight", "projectile-range", "projectile-max-height"],
    derivation: [
      "Horizontal: no horizontal force (ignoring air resistance), so horizontal velocity ux = u cos θ stays constant. Horizontal distance x = ux t.",
      "Vertical: acceleration = −g. Vertical velocity uy = u sin θ. Using v = u + at vertically: vy = uy − gt.",
      "Time of flight (returning to launch height): using s = ut + ½at² vertically with s = 0 net displacement: 0 = uy T − ½gT², giving T = 2uy/g.",
      "Maximum height: at the top, vy = 0. Using v² = u² + 2as vertically: 0 = uy² − 2gH, so H = uy²/(2g).",
      "Range: horizontal distance covered during the full time of flight: R = ux T = ux(2uy/g) = (u² sin 2θ)/g.",
    ],
    workedExamples: [
      {
        title: "Ball kicked at an angle",
        solution: {
          given: ["Initial speed u = 20 m/s", "Angle of projection θ = 30° above horizontal", "g = 10 m/s²", "Launched and lands at same height"],
          find: "Time of flight, maximum height, and range",
          principle: "Split the motion into independent horizontal (constant velocity) and vertical (constant acceleration) components.",
          formula: "T = 2u sin θ / g;  H = (u sin θ)² / (2g);  R = u² sin 2θ / g",
          whyFormula: "These formulas come directly from applying SUVAT separately to the vertical (for T and H) and combining with constant horizontal velocity (for R).",
          substitution: "uy = 20 sin30° = 10 m/s;  T = 2(10)/10;  H = 10²/(2×10);  R = 20² × sin60° / 10",
          calculation: ["T = 20/10 = 2 s", "H = 100/20 = 5 m", "sin 60° = 0.866, so R = 400 × 0.866/10 = 34.6 m"],
          units: "T in s, H in m, R in m",
          finalAnswer: "T = 2 s, H = 5 m, R ≈ 34.6 m",
          meaning: "The ball stays in the air for 2 seconds, rises to 5 m at its peak, and lands 34.6 m from where it was kicked.",
        },
      },
    ],
    commonMistakes: [
      "Using the full initial speed u instead of its vertical component (u sin θ) when finding height or time of flight.",
      "Forgetting that horizontal velocity does NOT change during flight (assuming no air resistance).",
      "Using the range formula when launch and landing heights are different (it only applies when they are equal).",
      "Sign errors when taking 'upward' as positive but forgetting gravity is negative in that convention.",
    ],
    summary: [
      "Horizontal and vertical motions are independent, linked only by time.",
      "Horizontal velocity constant; vertical velocity changes at rate g.",
      "At maximum height, vertical velocity = 0 (but horizontal velocity is unchanged).",
      "R = u²sin2θ/g only when launch height = landing height.",
    ],
    simulationId: "projectile-simulator",
  },
  {
    topicId: "newton-laws",
    simpleExplanation:
      "Objects don't change their motion by themselves — something (a resultant force) must push or pull them. The bigger the force for a given mass, the bigger the acceleration. And forces always come in equal, opposite pairs acting on two different objects.",
    definition:
      "First Law (inertia): a body remains at rest or moves with constant velocity unless acted on by a resultant (net) external force. Second Law: the resultant force on a body equals the rate of change of momentum; for constant mass, F = ma. Third Law: if body A exerts a force on body B, body B exerts an equal and opposite force on body A.",
    realLifeExplanation:
      "Passengers in a matatu jerk forward when the driver brakes suddenly — their bodies obey Newton's First Law by continuing to move forward until the seatbelt (a force) acts on them. A boda boda accelerates faster with one passenger than with three, because the same engine force produces less acceleration on a larger mass (F = ma). When you jump off a boat, the boat moves backward — an example of the Third Law.",
    formulaIds: ["newtons-second-law", "weight-formula"],
    derivation: [
      "Newton's Second Law in its most general form: F = Δp/Δt (rate of change of momentum).",
      "Momentum p = mv. If mass m is constant, Δp = mΔv, so F = mΔv/Δt.",
      "Since Δv/Δt = acceleration a, this simplifies to F = ma — but only holds when mass does not change.",
    ],
    workedExamples: [
      {
        title: "Force needed to accelerate a loaded truck",
        solution: {
          given: ["Mass of truck m = 2000 kg", "Required acceleration a = 1.5 m/s²"],
          find: "The resultant force needed",
          principle: "Newton's Second Law: resultant force causes acceleration proportional to it and inversely proportional to mass.",
          formula: "F = ma",
          whyFormula: "We are directly given mass and required acceleration, and asked for the resultant force — F = ma relates exactly these three quantities.",
          substitution: "F = 2000 × 1.5",
          calculation: ["F = 3000 N"],
          units: "N (newtons)",
          finalAnswer: "F = 3000 N",
          meaning: "The truck's engine (through its wheels) must produce a net forward force of 3000 N (after subtracting friction and air resistance) to achieve this acceleration.",
        },
      },
    ],
    commonMistakes: [
      "Thinking a constant velocity needs a constant resultant force (it needs ZERO resultant force).",
      "Applying F = ma using the WEIGHT of an object instead of its mass.",
      "Believing action-reaction pairs act on the SAME object — they always act on two DIFFERENT objects, so they never cancel each other out for one body.",
      "Ignoring other forces (like friction) and assuming applied force alone equals resultant force.",
    ],
    summary: [
      "1st Law: no resultant force → no change in velocity (inertia).",
      "2nd Law: F(resultant) = ma.",
      "3rd Law: forces occur in equal, opposite pairs on different bodies.",
      "Always find the RESULTANT force before applying F = ma.",
    ],
  },
  {
    topicId: "friction",
    simpleExplanation:
      "Friction is a force that resists sliding between two surfaces in contact. It only becomes as large as needed to prevent motion, up to a maximum value — after which the surfaces slip.",
    definition:
      "Friction is the force opposing relative sliding motion (or tendency of sliding) between two surfaces in contact. Limiting friction is the maximum value of static friction just before sliding begins. Kinetic (sliding) friction acts once motion occurs. Coefficient of friction μ = F(friction)/N (Normal reaction), and is different for static (μs) and kinetic (μk) cases, with μs ≥ μk generally.",
    realLifeExplanation:
      "A heavy box on the ground won't move even when you push gently — static friction matches your push exactly. Push harder, and once you exceed the limiting friction, the box suddenly slides, now resisted by (usually smaller) kinetic friction. This is also why boda boda tyres are treaded — to maintain a high coefficient of friction with wet murram roads.",
    formulaIds: ["friction-force", "incline-forces"],
    derivation: [
      "On a slope inclined at angle θ, resolve the weight (mg) into components: parallel to slope = mg sin θ (pulls object down the slope), perpendicular to slope = mg cos θ (pressed into the slope).",
      "The normal reaction N balances the perpendicular component: N = mg cos θ.",
      "Maximum friction available = μN = μ mg cos θ.",
      "The object begins to slide when mg sin θ > μ mg cos θ, i.e. when tan θ > μ.",
    ],
    workedExamples: [
      {
        title: "Box on a rough incline",
        solution: {
          given: ["Mass m = 10 kg", "Angle of incline θ = 20°", "Coefficient of kinetic friction μ = 0.3", "g = 10 m/s²"],
          find: "Whether the box slides, and if so, its acceleration down the slope",
          principle: "Compare the driving component of weight down the slope with the maximum available friction.",
          formula: "Driving force = mg sinθ; Max friction = μ mg cosθ; if driving > max friction, a = g(sinθ − μcosθ)",
          whyFormula: "We resolve weight along and perpendicular to the incline because friction depends on the normal reaction (perpendicular component), while sliding is governed by the parallel component.",
          substitution: "mg sinθ = 10×10×sin20°; μmg cosθ = 0.3×10×10×cos20°",
          calculation: [
            "mg sin20° = 100 × 0.342 = 34.2 N",
            "μ mg cos20° = 0.3 × 100 × 0.940 = 28.2 N",
            "Since 34.2 N > 28.2 N, the box slides.",
            "a = g(sinθ − μcosθ) = 10(0.342 − 0.3×0.940) = 10(0.342−0.282) = 0.6 m/s²",
          ],
          units: "N for forces, m/s² for acceleration",
          finalAnswer: "The box slides down with acceleration ≈ 0.6 m/s²",
          meaning: "Gravity's pull along the slope is just slightly bigger than the maximum grip friction can provide, so the box slowly accelerates downward.",
        },
      },
    ],
    commonMistakes: [
      "Using the full weight (mg) instead of the component along the slope (mg sinθ) or perpendicular to it (mg cosθ).",
      "Using μ with mg instead of with the actual Normal reaction N (which may not equal mg, e.g. on a slope or with an applied vertical force).",
      "Assuming friction always equals μN — this is only true once motion is occurring or is on the point of occurring (limiting case); otherwise friction equals whatever is needed for equilibrium, up to that maximum.",
      "Forgetting friction always opposes the direction of relative sliding (or attempted sliding).",
    ],
    summary: [
      "Friction ≤ μN normally; friction = μN only at the limiting/kinetic condition.",
      "On an incline: component along slope = mg sinθ; perpendicular = mg cosθ = N.",
      "Object slides if mg sinθ > μ mg cosθ, i.e. tanθ > μ.",
      "Kinetic friction is usually slightly less than the maximum static (limiting) friction.",
    ],
  },
  {
    topicId: "free-body-diagrams",
    simpleExplanation:
      "A free body diagram (FBD) is a simplified sketch of ONE object showing every force acting ON it (not forces it exerts on other things) as arrows, each starting from the object.",
    definition:
      "A free body diagram represents an isolated object as a point or simple shape, with labelled arrows showing the direction and relative size of every external force acting on that object alone.",
    realLifeExplanation:
      "Engineers designing a suspension bridge draw an FBD of each cable and each section of the deck to make sure every force is accounted for before calculating tensions — missing even one force (like wind load) could cause a design failure.",
    formulaIds: [],
    workedExamples: [
      {
        title: "FBD of a box resting on a horizontal table",
        solution: {
          given: ["A box of weight W rests on a horizontal table, no other forces applied"],
          find: "All forces acting on the box, and their relationship",
          principle: "In equilibrium, the vector sum of all forces on the object is zero.",
          formula: "N = W (for horizontal surface, no other vertical forces)",
          whyFormula: "The box is not accelerating vertically, so by Newton's First/Second Law the resultant vertical force must be zero — the only two vertical forces are weight (down) and normal reaction (up), so they must be equal.",
          substitution: "N (up) − W (down) = 0",
          calculation: ["N = W"],
          units: "N (newtons)",
          finalAnswer: "Normal reaction N = Weight W",
          meaning: "The table pushes up on the box exactly as hard as gravity pulls it down, which is why the box stays still rather than sinking through the table or floating up.",
        },
      },
    ],
    commonMistakes: [
      "Including forces the object exerts ON other things instead of forces acting ON the object.",
      "Drawing the Normal Reaction in the wrong direction (it is always perpendicular to the contact surface, pointing away from it).",
      "Forgetting friction when a surface is rough and there is (or could be) relative sliding tendency.",
      "Missing a force entirely, such as air resistance or tension in a second string.",
      "Drawing both members of an action-reaction pair on the SAME object's FBD (they never both act on one object).",
    ],
    summary: [
      "FBD shows all EXTERNAL forces on ONE object only.",
      "Common forces: weight (always straight down), normal reaction (perpendicular to surface), tension (along string, pulling away from object), friction (opposing relative sliding, along the surface), applied force, air resistance/drag, upthrust.",
      "Equilibrium ⇒ vector sum of forces = 0 (resolve into components if needed).",
    ],
    simulationId: "fbd-builder",
  },
  {
    topicId: "momentum-impulse",
    simpleExplanation:
      "Momentum is 'quantity of motion' — a heavy fast-moving object is hard to stop because it has a lot of momentum. In any collision or explosion, as long as no external force interferes, total momentum before equals total momentum after.",
    definition:
      "Momentum p = mv (mass × velocity), a vector, SI unit kg m/s. Impulse J = FΔt = Δp, the change in momentum caused by a force acting over a time interval. Law of Conservation of Momentum: in a closed system (no external resultant force), total momentum before an interaction equals total momentum after.",
    realLifeExplanation:
      "In a car crash, airbags and seatbelts increase the TIME over which the passenger's momentum changes to zero, which (since impulse = FΔt is fixed by the required change in momentum) REDUCES the average force experienced — this is exactly why airbags save lives. Similarly, a boda boda rider bends their knees on landing a jump to increase impact time and reduce force on their body.",
    formulaIds: ["momentum-def", "impulse-def", "conservation-momentum"],
    derivation: [
      "From Newton's Second Law: F = Δp/Δt.",
      "Rearranging: FΔt = Δp. This quantity FΔt is defined as impulse.",
      "For a system of colliding bodies with no external force, Newton's Third Law means the internal forces between the bodies are equal and opposite, and act for the same time — so their impulses cancel exactly.",
      "Therefore the total momentum of the system is unchanged: total momentum before = total momentum after.",
    ],
    workedExamples: [
      {
        title: "Collision between two boda bodas (1D)",
        solution: {
          given: ["Boda A: mass 120 kg, velocity 8 m/s", "Boda B: mass 100 kg, velocity 0 m/s (stationary)", "They collide and move off together (perfectly inelastic)"],
          find: "Their common velocity after collision",
          principle: "Conservation of momentum: total momentum before = total momentum after (no external horizontal force during the brief collision).",
          formula: "m1u1 + m2u2 = (m1+m2)v",
          whyFormula: "This is exactly the conservation of momentum equation for a perfectly inelastic collision, where the objects stick together and share one final velocity.",
          substitution: "(120×8) + (100×0) = (120+100) × v",
          calculation: ["960 + 0 = 220v", "v = 960/220 = 4.36 m/s"],
          units: "m/s",
          finalAnswer: "v ≈ 4.36 m/s",
          meaning: "After the crash, the tangled boda bodas move off together at about 4.36 m/s — slower than boda A's original speed because its momentum is now shared with the extra stationary mass.",
        },
      },
    ],
    commonMistakes: [
      "Forgetting momentum is a VECTOR — objects moving in opposite directions must have opposite signs.",
      "Applying conservation of momentum when there IS a significant external force (e.g. over a long time with friction/gravity acting) — it strictly applies to the brief collision/explosion instant.",
      "Confusing elastic collisions (both momentum AND kinetic energy conserved) with inelastic collisions (only momentum conserved; KE is lost, e.g. to heat/sound/deformation).",
      "Using speed instead of velocity (ignoring direction) in the conservation equation.",
    ],
    summary: [
      "p = mv; J = FΔt = Δp.",
      "Momentum is always conserved in a closed system, even in explosions and inelastic collisions.",
      "Elastic collision: momentum AND kinetic energy conserved. Inelastic collision: momentum conserved, KE is NOT.",
      "Increasing impact TIME reduces the force for a given change in momentum — the basis of safety design.",
    ],
    simulationId: "collision-simulator",
  },
  {
    topicId: "work-energy-power",
    simpleExplanation:
      "Work is done when a force moves something. Energy is the capacity to do work, and it can change form but never be created or destroyed. Power tells us how quickly energy is transferred.",
    definition:
      "Work done W = Fs cosθ, where θ is the angle between the force and the displacement (Joules). Kinetic energy KE = ½mv² (energy of motion). Gravitational potential energy GPE = mgh (energy due to height in a gravitational field). Power P = W/t = Fv (rate of doing work). Efficiency = (useful energy output/total energy input) × 100%.",
    realLifeExplanation:
      "When a construction crane lifts blocks to build a storeyed building in Kampala, it converts electrical energy into gravitational potential energy of the blocks. A more powerful crane motor does the same work in less time. Some energy is always 'lost' as heat and sound in the motor and cables — that's why efficiency is never 100%.",
    formulaIds: ["work-done", "kinetic-energy", "gpe", "power-def", "efficiency"],
    derivation: [
      "Work-energy theorem: the work done by the resultant force equals the change in kinetic energy.",
      "Starting from v² = u² + 2as (SUVAT), multiply both sides by ½m: ½mv² = ½mu² + mas.",
      "Since F = ma, mas = Fs = work done. So ½mv² − ½mu² = W(resultant), i.e. work done = change in KE.",
    ],
    workedExamples: [
      {
        title: "Lifting cement bags with a pulley",
        solution: {
          given: ["Mass of cement bag = 50 kg", "Lifted vertically through height h = 6 m", "Time taken = 5 s", "g = 10 m/s²"],
          find: "Work done, and the average power developed",
          principle: "Work is done against gravity to raise the bag; power is the rate of doing this work.",
          formula: "W = mgh; P = W/t",
          whyFormula: "Lifting at constant (or near-constant) speed against gravity means the applied force does work exactly equal to the gain in gravitational PE, mgh; dividing by time gives the average power required.",
          substitution: "W = 50×10×6; P = W/5",
          calculation: ["W = 3000 J", "P = 3000/5 = 600 W"],
          units: "W in Joules, P in Watts",
          finalAnswer: "Work done = 3000 J; Power = 600 W",
          meaning: "The winch must supply energy at a rate of 600 Joules every second (600 W) to lift the cement bag steadily in 5 seconds.",
        },
      },
    ],
    commonMistakes: [
      "Calculating work done without checking whether force and displacement are in the same direction (use W = Fs cosθ, not always W = Fs).",
      "Forgetting that if the force is perpendicular to displacement, NO work is done (e.g. carrying a bag horizontally does no work against gravity).",
      "Mixing up power (rate of energy transfer, Watts) with energy/work (Joules).",
      "Assuming all input energy becomes useful output energy — always account for losses (heat, sound, friction) using efficiency.",
    ],
    summary: [
      "W = Fs cosθ (Joules); no work if force ⟂ displacement.",
      "KE = ½mv²; GPE = mgh.",
      "Total mechanical energy is conserved if only conservative forces act (no friction/air resistance).",
      "P = W/t = Fv; efficiency = useful output/total input × 100%.",
    ],
  },
  {
    topicId: "circular-motion",
    simpleExplanation:
      "An object moving in a circle at constant speed is still accelerating, because its DIRECTION keeps changing. This acceleration always points toward the centre of the circle, and needs a resultant force (also toward the centre) to cause it.",
    definition:
      "Angular velocity ω = angle swept per unit time (rad/s). For circular motion, linear speed v = rω. Centripetal acceleration a = v²/r = ω²r, directed toward the centre of the circle. Centripetal force F = mv²/r = mω²r is the RESULTANT force required to keep the object moving in the circle.",
    realLifeExplanation:
      "When a car goes round a roundabout, friction between the tyres and road supplies the centripetal force needed to keep turning. If the road is wet or the car goes too fast, the maximum available friction is exceeded and the car skids outward off its circular path — it does NOT get 'flung outward' by a mysterious 'centrifugal force'; rather it fails to be pulled inward enough.",
    formulaIds: ["angular-velocity", "centripetal-acceleration", "centripetal-force"],
    derivation: [
      "For an object moving at constant speed v around a circle of radius r, in a small time δt it sweeps a small angle δθ = (v δt)/r (arc length = radius × angle).",
      "Angular velocity ω = δθ/δt = v/r, so v = rω.",
      "Even though speed is constant, velocity DIRECTION changes constantly; the rate of change of velocity (acceleration) can be shown geometrically (or via calculus) to have magnitude v²/r, always directed toward the centre.",
      "By Newton's Second Law, the resultant (centripetal) force needed is F = ma = mv²/r = mω²r (using v = rω).",
    ],
    workedExamples: [
      {
        title: "Car rounding a bend",
        solution: {
          given: ["Mass of car m = 900 kg", "Radius of bend r = 40 m", "Speed v = 12 m/s"],
          find: "The centripetal force required, and its likely source",
          principle: "Any object moving in a circle needs a resultant inward (centripetal) force; here it is provided by friction between tyres and road.",
          formula: "F = mv²/r",
          whyFormula: "We are given mass, radius and speed directly, and this is the direct formula for the required centripetal force from these quantities.",
          substitution: "F = 900 × 12² / 40",
          calculation: ["F = 900 × 144 / 40", "F = 129600/40 = 3240 N"],
          units: "N (newtons)",
          finalAnswer: "F = 3240 N",
          meaning: "Friction between the tyres and the road must supply at least 3240 N of inward force for the car to safely follow the bend; if the road is too slippery to provide this, the car will skid outward.",
        },
      },
    ],
    commonMistakes: [
      "Treating centripetal force as an EXTRA separate force to add to a free body diagram — it is the name given to the RESULTANT of the real forces (friction, tension, gravity, normal reaction, etc.) already acting.",
      "Believing there's an outward 'centrifugal force' acting on the object in an inertial (non-rotating) frame — there isn't; the sensation is due to inertia (the object tends to move in a straight line).",
      "Confusing angular velocity ω (rad/s) with linear velocity v (m/s) — remember v = rω.",
      "Using diameter instead of radius in the centripetal formulas.",
    ],
    summary: [
      "v = rω; a = v²/r = ω²r; F = mv²/r = mω²r, always directed toward the centre.",
      "Centripetal force is the RESULTANT of real forces already present — not a new force.",
      "Constant speed in a circle still means the object is accelerating (direction changes).",
    ],
    simulationId: "circular-motion-simulator",
  },
  {
    topicId: "gravitation-fields",
    simpleExplanation:
      "Every mass attracts every other mass. Close to Earth we call this 'weight', but the same rule (with the same underlying law) governs how the Moon orbits Earth and how satellites stay up.",
    definition:
      "Newton's Law of Universal Gravitation: F = Gm1m2/r², an attractive force between any two point masses. Gravitational field strength g = F/m (force per unit mass, N/kg, numerically equal to acceleration due to gravity, m/s²). Gravitational potential V = −Gm/r (work done per unit mass to bring a small mass from infinity to that point; always negative, zero at infinity). Gravitational potential energy GPE = −Gm1m2/r.",
    realLifeExplanation:
      "Communication satellites used for TV and mobile networks over Uganda are placed in geostationary orbit, 35,786 km above the equator, where their orbital period exactly matches Earth's rotation (24 hours), so they appear to 'hover' over the same spot on Earth — a direct application of gravitational orbital mechanics.",
    formulaIds: ["newton-gravitation", "field-strength", "orbital-velocity", "geostationary"],
    derivation: [
      "For a satellite of mass m in a circular orbit of radius r around a planet of mass M, gravity provides the centripetal force: GMm/r² = mv²/r.",
      "Cancel m and one r: GM/r = v², so orbital speed v = √(GM/r).",
      "Using v = 2πr/T (T = period): (2πr/T)² = GM/r ⟹ T² = 4π²r³/GM — Kepler's Third Law falls directly out of Newton's law of gravitation.",
    ],
    workedExamples: [
      {
        title: "Orbital speed of a low-Earth satellite",
        solution: {
          given: ["Orbital radius r = 6.8 × 10⁶ m (just above Earth's surface)", "Earth's mass M = 6.0 × 10²⁴ kg", "G = 6.67 × 10⁻¹¹ N m²/kg²"],
          find: "The orbital speed required",
          principle: "Gravitational force provides exactly the centripetal force needed for circular orbit.",
          formula: "v = √(GM/r)",
          whyFormula: "Equating gravitational force to the required centripetal force and solving for v gives this direct relationship between orbital speed and orbital radius.",
          substitution: "v = √((6.67×10⁻¹¹ × 6.0×10²⁴)/(6.8×10⁶))",
          calculation: ["GM = 4.0×10¹⁴", "GM/r = 4.0×10¹⁴/6.8×10⁶ = 5.88×10⁷", "v = √(5.88×10⁷) ≈ 7670 m/s"],
          units: "m/s",
          finalAnswer: "v ≈ 7.67 km/s",
          meaning: "A satellite must travel at roughly 7.7 km/s (about 27,600 km/h!) to maintain a stable low-Earth orbit — any slower and gravity pulls it down; any faster and it flies off into a higher orbit.",
        },
      },
    ],
    commonMistakes: [
      "Confusing gravitational FIELD STRENGTH g (N/kg, a vector, force per unit mass) with gravitational POTENTIAL V (J/kg, a scalar, energy per unit mass).",
      "Forgetting the negative sign in gravitational potential and potential energy formulas (they represent a 'well', with zero at infinity being the maximum, not minimum).",
      "Using g = 9.8 m/s² for orbital or planetary calculations far from Earth's surface — g varies with distance (g = GM/r²).",
      "Confusing mass (kg, unchanging) with weight (N, = mg, changes with location).",
    ],
    summary: [
      "F = Gm1m2/r² (always attractive).",
      "g = GM/r² (field strength = force per unit mass).",
      "V = −GM/r (potential = energy per unit mass, taken as zero at infinity).",
      "Orbital motion: gravity supplies the centripetal force, giving v = √(GM/r) and T² ∝ r³.",
    ],
    simulationId: "orbital-simulator",
  },
  {
    topicId: "moments-equilibrium",
    simpleExplanation:
      "A moment is the turning effect of a force. The further from the pivot (and the bigger the force), the bigger the turning effect. For something to balance, clockwise turning effects must exactly equal anticlockwise turning effects.",
    definition:
      "Moment of a force = Force × perpendicular distance from the pivot to the line of action of the force (units: N m). Principle of Moments: for a body in rotational equilibrium, the sum of clockwise moments about any point equals the sum of anticlockwise moments about that same point. A couple is a pair of equal, opposite, parallel forces whose lines of action do not coincide, producing rotation with no resultant force.",
    realLifeExplanation:
      "A see-saw balances when a heavy child sits close to the pivot and a lighter child sits further away, because the products of (weight × distance) are equal on both sides. Similarly, a mechanic uses a long spanner (wrench) to loosen a tight nut, because increasing the distance from the pivot increases the moment for the same applied force, making the job easier.",
    formulaIds: ["moment-def", "principle-of-moments"],
    workedExamples: [
      {
        title: "Balancing a uniform beam",
        solution: {
          given: ["A uniform beam of length 4 m pivoted at its centre", "A 30 N weight hangs 1.5 m from the pivot on the left", "An unknown weight W hangs 2 m from the pivot on the right"],
          find: "The value of W needed for the beam to balance",
          principle: "Principle of moments: for equilibrium, clockwise moment = anticlockwise moment about the pivot.",
          formula: "Sum of clockwise moments = sum of anticlockwise moments",
          whyFormula: "The beam is uniform and pivoted at its centre, so its own weight acts exactly at the pivot and produces no moment; only the two hanging weights create turning effects, which must balance for equilibrium.",
          substitution: "30 × 1.5 (anticlockwise) = W × 2 (clockwise)",
          calculation: ["45 = 2W", "W = 22.5 N"],
          units: "N (newtons)",
          finalAnswer: "W = 22.5 N",
          meaning: "A weight of 22.5 N placed 2 m from the pivot on the right exactly balances the 30 N weight placed closer (1.5 m) on the left, because 30×1.5 = 22.5×2 = 45 N m in both cases.",
        },
      },
    ],
    commonMistakes: [
      "Using the actual distance instead of the PERPENDICULAR distance from the pivot to the line of action of the force.",
      "Forgetting that the weight of a uniform beam/rod acts at its midpoint (centre of gravity), and DOES produce a moment if the pivot is not at the centre.",
      "Mixing up clockwise and anticlockwise directions when setting up the equation.",
      "Forgetting to also check translational equilibrium (sum of forces = 0) in addition to rotational equilibrium (sum of moments = 0).",
    ],
    summary: [
      "Moment = Force × perpendicular distance from pivot (N m).",
      "Principle of moments: ΣClockwise moments = ΣAnticlockwise moments (about any point) for rotational equilibrium.",
      "Full equilibrium requires BOTH zero resultant force AND zero resultant moment.",
      "A couple produces rotation only, with zero resultant force.",
    ],
    simulationId: "beam-balance-simulator",
  },
  {
    topicId: "shm-oscillations",
    simpleExplanation:
      "In simple harmonic motion, an object oscillates back and forth, always being pulled back toward the centre by a restoring force proportional to how far it has moved from that centre.",
    definition:
      "Simple Harmonic Motion (SHM) is oscillatory motion in which the acceleration is directly proportional to the displacement from a fixed equilibrium point, and always directed toward that point: a = −ω²x. Amplitude (A) = maximum displacement. Period (T) = time for one complete oscillation. Frequency (f) = 1/T. Angular frequency ω = 2πf = 2π/T.",
    realLifeExplanation:
      "A child on a swing, a mass bobbing on a spring, or the pendulum of a grandfather clock, all show SHM (approximately) — each time they move away from the centre/rest position, a restoring force pulls them back, causing regular, repeating oscillation.",
    formulaIds: ["shm-acceleration", "shm-period-spring", "shm-period-pendulum"],
    derivation: [
      "For a mass m on a spring of stiffness k, Hooke's Law gives restoring force F = −kx.",
      "By Newton's Second Law, F = ma, so ma = −kx, giving a = −(k/m)x — this matches the SHM condition a = −ω²x with ω² = k/m.",
      "Since T = 2π/ω, the period of a mass-spring system is T = 2π√(m/k).",
    ],
    workedExamples: [
      {
        title: "Mass oscillating on a spring",
        solution: {
          given: ["Mass m = 0.5 kg", "Spring constant k = 20 N/m"],
          find: "The period of oscillation",
          principle: "A mass-spring system executes SHM with period governed by mass and stiffness.",
          formula: "T = 2π√(m/k)",
          whyFormula: "This formula comes directly from equating the spring's restoring force to Newton's Second Law and matching the resulting equation to the definition of SHM.",
          substitution: "T = 2π√(0.5/20)",
          calculation: ["0.5/20 = 0.025", "√0.025 ≈ 0.158", "T ≈ 2π × 0.158 ≈ 0.99 s"],
          units: "s (seconds)",
          finalAnswer: "T ≈ 1.0 s",
          meaning: "The mass completes one full up-and-down oscillation approximately every second — a stiffer spring or lighter mass would make this faster.",
        },
      },
    ],
    commonMistakes: [
      "Forgetting the negative sign in a = −ω²x, which shows the acceleration always opposes displacement (restoring, not driving, the motion).",
      "Confusing amplitude (maximum displacement) with distance travelled in one period (which is 4 × amplitude).",
      "Assuming maximum velocity occurs at maximum displacement — it actually occurs at the CENTRE (zero displacement), where all energy is kinetic.",
      "Using degrees instead of radians in ω-based formulas.",
    ],
    summary: [
      "a = −ω²x defines SHM; restoring force always points toward equilibrium.",
      "T = 2π√(m/k) for a spring; T = 2π√(l/g) for a simple pendulum (small angles).",
      "At maximum displacement: velocity = 0, acceleration is maximum. At equilibrium: velocity is maximum, acceleration = 0.",
      "Total energy in SHM (KE + PE) remains constant, continuously exchanging between kinetic and potential forms.",
    ],
    simulationId: "shm-simulator",
  },
  {
    topicId: "elasticity-hooke",
    simpleExplanation:
      "Stretch a spring gently and it returns to its original length when released (elastic). Stretch it too far, and it stays stretched permanently (plastic) or even snaps.",
    definition:
      "Hooke's Law: the extension of an elastic material is directly proportional to the applied force, provided the elastic limit is not exceeded: F = kx (k = spring/force constant, N/m). Stress = Force/Cross-sectional area (Pa). Strain = extension/original length (no units). Young's Modulus E = stress/strain (Pa), a measure of material stiffness.",
    realLifeExplanation:
      "Engineers select steel cables for a suspension bridge based on their Young's Modulus, ensuring the cables stretch only elastically (safely) under the heaviest expected traffic loads, well below their breaking stress.",
    formulaIds: ["hookes-law", "youngs-modulus", "elastic-energy"],
    derivation: [
      "Work done stretching a spring = area under the force-extension graph.",
      "For an ideal spring obeying Hooke's Law (F = kx), the graph is a straight line through the origin, so the area under it up to extension x is a triangle: Area = ½ × base × height = ½ × x × F = ½ × x × kx.",
      "Therefore elastic potential energy stored E = ½kx².",
    ],
    workedExamples: [
      {
        title: "Energy stored in a stretched spring",
        solution: {
          given: ["Spring constant k = 250 N/m", "Extension x = 0.08 m", "Elastic limit not exceeded"],
          find: "The elastic potential energy stored",
          principle: "Elastic potential energy equals the work done stretching the spring, which is the area under its force-extension graph.",
          formula: "E = ½kx²",
          whyFormula: "Since the spring obeys Hooke's Law, the force-extension graph is a straight line, and the area under it (a triangle) gives exactly ½kx².",
          substitution: "E = ½ × 250 × 0.08²",
          calculation: ["0.08² = 0.0064", "E = 0.5 × 250 × 0.0064 = 0.8 J"],
          units: "J (joules)",
          finalAnswer: "E = 0.8 J",
          meaning: "0.8 Joules of energy is stored in the stretched spring, which would be released as kinetic energy if the spring were suddenly allowed to contract (e.g. as in a catapult).",
        },
      },
    ],
    commonMistakes: [
      "Using F = kx beyond the elastic limit, where the material no longer obeys Hooke's Law.",
      "Confusing stress (force per unit area, Pa) with pressure conceptually different context, or with plain force (N).",
      "Forgetting strain has NO units (it is a ratio of two lengths).",
      "Using original length instead of extension (or vice versa) when calculating strain.",
    ],
    summary: [
      "F = kx only up to the elastic limit (Hooke's Law region).",
      "Stress = F/A; Strain = x/L; Young's Modulus E = stress/strain.",
      "Elastic PE stored = ½kx² = area under a straight-line force-extension graph.",
      "Beyond the elastic limit, permanent (plastic) deformation occurs; beyond the breaking point, the material fails.",
    ],
    simulationId: "elasticity-grapher",
  },
];

export function getLessonByTopic(topicId: string): Lesson | undefined {
  return LESSONS.find((l) => l.topicId === topicId);
}
