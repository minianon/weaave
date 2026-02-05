# Galaxy AI Assignment - Weavy Clone Demo Script (3-Node Version)

**Context**: Submission for Galaxy AI.
**Tone**: Natural, conversational.
**Duration**: 3-5 Minutes

---

## 1. Intro & Homepage (0:00 - 0:45)

**(Visual: Start on the Landing Page. Scroll down slightly.)**

**Speaker:**
"Hi everyone! This is my submission for the **Galaxy AI** assignment. I’ve built a pixel-perfect clone of the **Weavy AI** workflow builder, and I want to walk you through it."

"Here we are on the homepage. I tried to keep the design really clean and premium—using that glassmorphism style we see on Weavy."

**Speaker:**
"But let's not just look at it... **let's authenticate** and get into the app."

**(Visual: Click 'Sign In' -> Clerk Login -> Dashboard.)**

**Speaker:**
"I'm using Clerk for the authentication here... secure and fast. And... we're in."

---

## 2. Dashboard & "Let's Create One" (0:45 - 1:15)

**(Visual: Land on the empty Dashboard.)**

**Speaker:**
"Okay, so here's the dashboard. As you can see... it's empty. There are no workflows yet."

**Speaker:**
"So, **let's create one**."

**(Visual: Click 'New Workflow'. Name it 'Content Generator'.)**

**Speaker:**
"I'll give this a name... let's call it 'Content Generator'. Create."

---

## 3. Building the Workflow (Available Nodes) (1:15 - 2:30)

**(Visual: The empty canvas loads. Open Sidebar.)**

**Speaker:**
"Here’s our canvas. Now... **what should I add?**"

**Speaker:**
"I want to build a flow that takes a user instruction and an image, and processes it with an LLM. So, I'll need three things."

**(Visual: Drag 'Text Node'.)**

**Speaker:**
"First, a **Text Node** for my prompt or instruction."

**(Visual: Drag 'Image Node'.)**

**Speaker:**
"Second, an **Image Node** to handle the file upload."

**(Visual: Drag 'Run Any LLM' Node.)**

**Speaker:**
"And finally, the **Run Any LLM** node—this is the brain that will connect to Gemini."

**(Visual: Connect Text -> LLM, and Image -> LLM.)**

**Speaker:**
"Connecting them is super smooth. Text goes into the LLM... Image goes into the LLM. The edges snap right into place."

---

## 4. Configuration & Upload (2:30 - 3:00)

**(Visual: Click Text Node. Type a prompt.)**

**Speaker:**
"Let's configure the inputs. For the text, I'll tell it: 'Analyze this image and write a catchy social media caption for it.'"

**(Visual: Click Image Node. Upload a file.)**

**Speaker:**
"For the image, I'll upload a sample... let's go with this product shot."

**(Visual: Click LLM Node. Select Model (if available) or show it's ready.)**

**Speaker:**
"And the LLM node is ready to receive both data streams."

---

## 5. Execution & Real-Time Feedback (3:00 - 3:45)

**(Visual: Click 'Run Workflow'.)**

**Speaker:**
"Alright, logic is set. Let's run it."

**(Visual: Mouse over the running nodes.)**

**Speaker:**
"Watch the nodes. You see that pulsating glow? That’s the real-time status. It’s analyzing the text... now processing the image..."

**(Visual: Wait for green checkmarks and output in LLM node.)**

**Speaker:**
"And... boom. All green. If I check the LLM node output... there's our caption. It works perfectly."

---

## 6. Granular Control & History (3:45 - 4:15)

**(Visual: Select just the LLM node.)**

**Speaker:**
"Now, if I want to just tweak the prompt, I don't need to re-upload the image. I can just select the **Run Any LLM** node... right-click... and **Run Selected**."

**Speaker:**
"It treats the previous inputs as cached or ready, and just re-runs the intelligence layer."

**(Visual: Open Right Sidebar -> 'Run History'.)**

**Speaker:**
"Over on the right, we have the **Run History**. Every execution is logged, so I can go back and debug exactly what data passed through the wires."

---

## 7. Export & Outro (4:15 - End)

**(Visual: Click Export.)**

**Speaker:**
"Finally, I can export this flow as JSON to share it."

**Speaker:**
"So that's my submission. A fully functional AI workflow builder with text, vision, and LLM integration. Thanks for watching!"
