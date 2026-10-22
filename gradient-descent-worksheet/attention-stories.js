/* Original lecture: visual arguments, testable toy models, and nearby primary sources. */
window.AttentionStories = {
    language: {
        title: 'Start with the bowl. What is learning?',
        intro: 'Finish this sentence: “The trail was…” steep? quiet? muddy? I built a tiny language model that only has two scores it can adjust. The marble is one pair of settings for those scores. The height tells you how badly those settings predict ten made-up word examples. Take a step and watch the guesses change.',
        principle: 'The marble is the model’s settings. The height is how wrong it is on the training examples.',
        legend: [['training error','#a39aff'],['current model','#ffd481'],['full-data optimum','#72e6ce']],
        limit: 'Heads up: this bowl is real math, but it’s tiny. It’s a smooth, single-dip bowl (no sneaky local holes), built from just two scores. Real language models have billions of settings, so think of this as one small slice of the idea. And the marble isn’t a word, a person, or a neuron. It’s just the model’s settings.',
        prediction: ['If the error (we call it “loss”) goes down, what actually got better?', ['Agreement with the training examples', 'Proof that every answer is true'],0,'Yes! Lower loss just means the model matches these examples better. Whether its answers are true or useful is a whole separate check.'],
        reasoning: [
            ['Turn scores into chances', 'The model’s two scores, a and b (plus a fixed 0), get turned into probabilities that add up to 1. That squishing step is called softmax(a, b, 0). Out of our ten example endings, six are “steep,” three are “quiet,” and one is “muddy.” So the perfect guesses would be 0.6, 0.3, and 0.1.'],
            ['Nudge toward what you saw', 'Here’s the cool part: for each score, the slope (the gradient) is just current probability − how often that word showed up in the examples you picked. Subtract a fraction of that gap and you’ve taken a step. If you only pick one example, it might be the odd “muddy” one, so that step can wander off. The bowl itself never changes; you’re just sampling different rows from the same ten.'],
            ['So what about ChatGPT?', 'Predicting the next piece of text (a “token”) is the foundation of how language models learn. But following instructions takes extra training on top of that. The 2022 InstructGPT paper describes using example answers and people’s preferences. My toy only does the next-word part, not every stage or any company’s secret recipe. Also: when ChatGPT writes you a reply, it isn’t retraining itself. That’s a different step.']
        ],
        evidence: 'Training connection: <a href="https://arxiv.org/abs/2203.02155">Ouyang et al., 2022 · InstructGPT</a>. The toy example and its numbers are ours.',
        prompt: 'Start with every word equally likely. Predict which way a step using all ten examples will go. Then explain why one “muddy” example could point somewhere else.'
    },
    objective: {
        title: 'Downhill toward… whose goal?',
        intro: 'Imagine a compass with two possible destinations: “keep watching” and “I’m glad I spent my time on that.” An optimizer is like a super obedient hiker. It goes wherever its goal (its objective) tells it to, no questions asked. Move the goal-weight slider and watch the bottom of the bowl move. The walking rule never changes. Only the destination does.',
        principle: 'A great optimizer can do an amazing job chasing the wrong goal.',
        legend: [['watching target','#ff967f'],['reflection target','#72d6ff'],['weighted optimum','#72e6ce'],['current estimate','#ffd481']],
        limit: 'These two targets are made up. They live in a pretend two-knob space, not real spots in anyone’s mind. Notice what’s different from studio 1: here we’re changing the goal on purpose. Back there, the random examples changed each step, but the goal stayed put.',
        prediction: ['The optimizer made it to the bottom. Does that prove the goal was a good one?', ['Yes: convergence is the same as wellbeing', 'No: check what the height measures'],1,'Exactly. Reaching the bottom only says the math worked. Picking the goal is a totally different question: what do we actually want, and what can we measure?'],
        reasoning: [
            ['Spot the stand-in', 'A computer can easily see a watch, a comment, or a replay. It can’t easily see whether you understood something, whether you enjoyed it afterward, or whether you spent your time the way you meant to. So it uses the easy stuff as a stand-in, called a proxy. A proxy can be useful without being the real goal.'],
            ['Move the destination on purpose', 'My toy loss is a weighted average of how far you are from each of the two targets (squared). So the bottom of the bowl lands at that same weighted average of the targets. The slope is just where you are minus that blended target. A 25% step closes a quarter of the remaining gap.'],
            ['Don’t mix up the machines', 'A chatbot and a video feed both learn by chasing goals, but they don’t have to use the same data, design, or goal. The fact that ChatGPT gets trained on people’s preferences does not mean it’s secretly trained to keep you scrolling.']
        ],
        evidence: 'Engineering context: <a href="https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/">Covington et al., 2016 · candidate generation and ranking</a>. This is a historical example, not a specification of today’s feeds.',
        prompt: 'Think of one time a long watch means you’re interested, and one time it means you’re confused or annoyed. What extra feedback would help a computer tell those apart?'
    },
    ranking: {
        title: 'A hate-watch still leaves a signal',
        intro: 'Welcome to Lunchbreak, a made-up feed with six clips: trail advice, a goat who steals a quiz, pottery, stars, a cliffhanger, and a ridiculous argument about socks. First, rank them by how much people are predicted to watch and comment. Then add “glad I watched.” Which clips make it into the top three?',
        principle: 'Seeing that someone engaged doesn’t tell you why they engaged.',
        legend: [['candidate towers: final score','#72d6ff'],['chosen top three','#ffd481']],
        limit: 'All six clips and their scores are invented, and you can see them all in the table. “Glad I watched” is a pretend survey answer, not a brain scan. Real feeds juggle tons of signals, rules, and safety checks. “Only watch time matters” is a simplification I’m using to teach the idea.',
        prediction: ['A clip gets a ton of comments. What do we actually know?', ['People endorse it', 'People commented; their reasons remain uncertain'],1,'Right! People comment to agree, correct, joke around, or rage. One action can mean a lot of different things.'],
        reasoning: [
            ['Guessing vs. choosing', 'Two different jobs are happening. A predictor guesses how people will react. A ranking rule then picks which clips to show. The height of each tower is its ranking score, not training error. When you reorder these clips, nothing is learning. No downhill step is happening.'],
            ['Check the math yourself', 'Engagement score = (1 − comment weight) × watching + comment weight × comments. The final score then mixes that with “glad I watched.” These are just weighted averages of the numbers in the table, and the top three really do change when you move the weights.'],
            ['Notice what’s hidden', 'If the sock argument gets people arguing, a ranker that loves comments might push it up without knowing whether anyone enjoyed it. That’s one way it could happen. It’s not proof that every real app rewards every angry post.']
        ],
        evidence: 'Attention evidence: <a href="https://pubmed.ncbi.nlm.nih.gov/31486666/">Brady et al., 2020</a> found that moral/emotional material captured early visual attention in their experiments, with related patterns in political tweet sharing. That context does not cover every meme or viewer.',
        prompt: 'Compare the goat and the sock argument. Which one wins when comments count a lot? Before calling that a “better” recommendation, what would you want to ask the viewer?'
    },
    outrage: {
        title: 'When approval trains the loop',
        intro: 'Creators pay attention to what gets likes. Viewers react. The ranker notices which posts get reactions. Now imagine a group that rewards outrage: all three of those can push each other in the same direction, like a loop that keeps feeding itself. Follow one pulse around the loop, then turn down the group’s approval bonus and see what happens.',
        principle: 'More angry posts doesn’t prove people feel angrier inside. Feedback can boost how people express themselves.',
        legend: [['creator expectations','#b7a0ff'],['viewer feedback','#ffd481'],['ranker expectations','#72d6ff']],
        limit: 'The three circles are a diagram, not three parts of your brain. My toy has just two kinds of posts, and I set it up so outrage gets extra approval. So it shows what happens if that’s true. It’s not a law of nature or a model of a real social network.',
        prediction: ['In this toy, outrage posts get more approval. What might creators learn?', ['That outrage expression gets rewarded here', 'That every viewer secretly feels more anger'],0,'Yes! They learn that acting outraged gets rewarded here. A like (or my simulation) can’t measure what anyone actually feels inside.'],
        reasoning: [
            ['Three different learners', 'A person can learn what their friends approve of. A creator can change what they post. An app can update its guesses about what gets reactions. These all affect each other, but they’re separate things, not one algorithm running inside everybody’s head.'],
            ['Follow one real update', 'The chosen post gets a made-up reward. The creator’s expectation moves 30% of the way toward it, and the ranker’s moves 25% of the way. Together, those expectations decide how likely each type of post is next time. Pick a new seed and you’ll get a different random sequence, but the same rule.'],
            ['What did the research actually measure?', 'A 2021 study found that positive feedback was linked to people posting more outrage later, and it tested this with experiments. It measured what people posted and how they learned from others. It didn’t diagnose addiction or directly read anyone’s anger. Group norms matter too, not just individual rewards.']
        ],
        evidence: '<a href="https://pubmed.ncbi.nlm.nih.gov/34389534/">Brady et al., 2021 · social learning and outrage expression</a>. Our two-type feedback loop is an illustration, not their fitted model.',
        prompt: 'Set the approval bonus to zero, reset, and compare two runs with different seeds. Why can short runs come out differently even when both post types earn the same reward on average?'
    },
    surprise: {
        title: 'The surprise lives in the gap',
        intro: 'Picture two decks of cards. One gives you 0.4 points of reward every single time. The other is shuffled: three cards worth 1.0 and nine worth 0.2. Do the math and both average out the same over twelve cards! But they feel totally different moment to moment, because one keeps surprising you. A short clip can work the same way: maybe the next one is the funny one, or the one with the answer. Flip a card and watch the expectation update.',
        principle: 'Surprise is what you got minus what you expected. That gap is called reward prediction error.',
        legend: [['predictable rewards','#72d6ff'],['variable rewards','#ffd481'],['learned expectation','#b7a0ff']],
        limit: 'The reward points are made up. The bar is a simple learning rule, not a dopamine meter. Same average reward doesn’t mean the same experience, and a surprise deck doesn’t prove addiction. It also doesn’t mean surprising content always beats predictable content.',
        prediction: ['You expect 0.4. The card gives 1.0. You move 25% of the way. What do you expect next?', ['0.55', '1.0', '0.25'],0,'Nice! The surprise is 1.0 − 0.4 = 0.6. Move a quarter of that: 0.4 + 0.25 × 0.6 = 0.55.'],
        reasoning: [
            ['It depends what you expected', 'The same reward can feel huge or totally normal depending on what you were expecting. Our rule is Q_next = Q + 0.25(reward − Q). Look familiar? It’s the same “move partway toward what you just saw” idea from earlier.'],
            ['Same shape, different job', 'Here Q is how much reward you expect. Back in the opening bowl, the settings were predicting word chances. The update rules look alike, but human learning from rewards, training a model, and generating text are not the same thing.'],
            ['Don’t stretch the research', 'Lindström and colleagues found reward-learning patterns in how people post on social media and tested social rewards with experiments. Using that idea to explain the feeling of “maybe the next one” while scrolling is my extension. Their results don’t prove every swipe trains you in exactly this way.']
        ],
        evidence: '<a href="https://pubmed.ncbi.nlm.nih.gov/33637702/">Lindström et al., 2021 · social rewards and posting behavior</a>. The deck, units, and 25% rate are teaching choices. <a href="https://pubmed.ncbi.nlm.nih.gov/34559816/">van Lieshout et al., 2021</a> also tested curiosity and willingness to wait for uncertain lottery outcomes. Applying that result to a cliffhanger is a hypothesis, not their measured scrolling effect.',
        prompt: 'Run the same twelve cards twice in different orders. Can you end up with a different final expectation even though the total reward is the same? Why do the most recent cards matter so much?'
    },
    stopping: {
        title: 'A feed can remove the finish line',
        intro: 'A book has a last page. A clip ends, and the feed instantly hands you another. My two lanes offer the exact same clips. The only difference: one lane gives you a “do I keep going?” moment after every fifth clip. The height of each bar shows the chance of getting that far, using a made-up rule for when people keep watching.',
        principle: 'Whether you keep going depends on the situation, not just on what’s next.',
        legend: [['no checkpoints','#ff967f'],['decision checkpoints','#72e6ce'],['reach probability','#ffd481']],
        limit: 'I invented this decision rule. Nobody measured it in an experiment on pause screens. The model stops at twenty clips. Real people have goals, friends, tiredness, and their own choices, and one probability can’t capture all that.',
        prediction: ['What does a checkpoint actually change in this experiment?', ['The content’s quality', 'The modeled continuation decision'],1,'Yes! Both lanes have the same twenty clips. The only thing that changes is the keep-going decision at the marked spots.'],
        reasoning: [
            ['Where’s the stopping point?', 'In a lot of feeds, the end of one clip isn’t a natural place to stop. Adding a moment to decide can create one. That’s an idea worth testing, not a guaranteed fix.'],
            ['Multiply the chances', 'To reach clip six, you have to choose “keep going” five times in a row. So the chance of getting there is all five of those chances multiplied together. Add up the reach chances for all twenty clips and you get the expected number of clips watched. Both lanes count the first clip.'],
            ['What I mean by “brain rot”', '“Brain rot” here is slang for quick, low-effort content, or that feeling of watching way more than you meant to. It’s not a medical diagnosis, and it doesn’t mean permanent brain damage. Ridiculous humor can be fun! The real question is whether your time matches what you wanted.']
        ],
        evidence: 'This checkpoint comparison is a classroom hypothesis. Its formula and assumptions are shown in the explanation; it is not a claim of a published effect size.',
        prompt: 'Move effort cost and checkpoint friction one at a time. Which one affects every clip-to-clip choice, and which one only affects clips 5, 10, and 15?'
    },
    exposure: {
        title: 'The feed teaches the feed',
        intro: 'If a feed mostly shows the sock argument, it mostly learns about sock arguments. It barely learns anything about the quiet clip, because it never showed it! In the bowl, that missing direction is completely flat: lots of guesses fit equally well, since there’s no data there. Collect examples of both types and watch the valley change shape.',
        principle: 'Never shown isn’t the same as disliked.',
        legend: [['error to observed rates','#a39aff'],['current predictions','#ffd481'],['minimizing predictions','#72e6ce']],
        limit: 'The data only changes when you collect new toy observations. Fitting just moves the marble around a bowl that stays the same. The fake viewers here always respond with the same chances, but real people and real feeds change over time.',
        prediction: ['The quiet clip was shown zero times. What can we say about how people respond to it?', ['It is zero', 'This dataset cannot estimate it'],1,'Exactly. Never showing it means we have no responses at all. That’s missing evidence, not proof that nobody likes it.'],
        reasoning: [
            ['Look at the actual counts', 'We start with eight sock-argument showings and six responses, and zero showings of the quiet clip. The loss compares each guess to how often that type actually got a response, and it counts each type more when it was shown more. So with zero quiet showings, the quiet guess counts for exactly nothing. (Technically it measures error against those overall rates, not the leftover randomness in each yes/no response.)'],
            ['Change the data, not the shaking', 'Once you collect examples of both types, that flat direction curves into a real valley. Now the fitting step has evidence in both directions. That’s why “just shake it more” can’t create information the data never had.'],
            ['Don’t overclaim', 'Behind the scenes, the true response rates are 0.65 for quiet and 0.75 for the argument. A small sample can come out different from either one. Showing a mix of clips gives you more evidence, but it doesn’t magically fix every bias or prove a clip is good for you.']
        ],
        evidence: 'This is an original missing-data demonstration. A ranking system’s choices affect which response labels become observable; that logic is separate from claims about a particular proprietary algorithm.',
        prompt: 'Fit before collecting any quiet examples. Why can the loss shrink while the quiet guess is still basically random? Then collect ten of each type and fit again.'
    },
    redesign: {
        title: 'Choose the bowl before choosing the downhill step',
        intro: 'Now you’re the designer! Add “glad I watched” to the ranking goal, add “keep going?” checkpoints, and pick how many clips you actually want to watch. Explore the landscape, then have the computer try all 121 combinations. How does your feed compare to one that only cares about engagement?',
        principle: 'Better optimizing can’t fix a bad definition of success.',
        legend: [['toy design loss','#a39aff'],['your design','#ffd481'],['best of 121 settings','#72e6ce']],
        limit: 'This landscape compares design choices, not a neural network’s settings. I made up the “glad I watched” scores, penalties, and behavior rule. The winner here wins my toy goal. It’s not the one true recipe for healthy technology.',
        prediction: ['The search finds the best of 121 settings. What do we still need to test?', ['Whether people actually prefer and benefit from that design', 'Nothing: the minimum settles it'],0,'Yes! My assumptions and everything I left out still need testing with real people. A computed minimum alone can’t prove a design is good for anyone.'],
        reasoning: [
            ['Make the trade-offs visible', 'The ranking can balance predicted engagement with “glad I watched.” The checkpoints change the chances to stop. In this model, those two controls affect different things, so don’t mix them up.'],
            ['Read the height honestly', 'Toy design loss = (1 − mean reflection)² + 0.06(1 − mean engagement)² + 0.08 × excess expected clips². If you stay within your clip budget, the excess is zero. Rankings jump from one order to another, so this landscape has stair steps instead of smooth slopes. That’s why we try all 121 grid settings instead of pretending we can take a smooth downhill step.'],
            ['Back to ChatGPT', 'Here’s the big takeaway for both: pick the goal carefully, then check the results. A smooth-talking text predictor still needs to be checked for truth and usefulness. An accurate engagement predictor still needs to be checked for whether its picks actually help people. The algorithms are different, but neither can figure out “what should we want?” just by optimizing.']
        ],
        evidence: '<a href="https://pubmed.ncbi.nlm.nih.gov/42203878/">Brady et al., 2026</a> randomized 2,000 participants to custom feeds over eight weeks. Engagement ranking amplified moralized/emotional material, but did not significantly change users’ own engagement behavior. A different ranking reduced such exposure with comparable enjoyment. These results support testing design alternatives, not this toy’s numerical predictions.',
        prompt: 'Suggest one change you could make yourself and one change an app could make. Explain how it works, what you would measure, and one thing your model misses.'
    }
};
