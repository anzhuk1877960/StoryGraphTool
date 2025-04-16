class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData["Title"]); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData["InitialLocation"]); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
        if (locationData.KeyItem) {
            if (!this.engine.state[locationData.KeyItem]) {
                this.engine.state[locationData.KeyItem] = true;
                this.engine.show("Your apartment keys! One of the local hooligan kids must've swiped them from you on your way to work. You quickly pick them up, sighing out of relief. However, you notice that they are strangely warm to the touch...");
            } else { 
                this.engine.show("Nothing else. You groan and stretch, hunger and lethargy weighing heavily on you.");
            }
        }

        if (key === "Kitchen") {
            if (!this.engine.state.hasEaten) {
                this.engine.state.hasEaten = true;
                this.engine.show("You open up the fridge, which is barely filled with the essentials. You grab some tushonka and a half empty bottle of flat Baikal soda. You notice that the tushonka you've been buying from the supermarket has become noticably more flavorless and...rubbery. You're too hungry to care and wash it down with the soda.");
            } else {
                this.engine.show("You're still full from your earlier meal. Besides, it's not like eating is much of a pleasurable experience for you anyway.");
            }
        }

        if (key === "Living Room") {
            if (!this.engine.state.hasWatchedTV) {
                this.engine.state.hasWatchedTV = true;
            //    this.engine.show("You sit on your blanket covered couch and turn on the television. You flip through the channels mindlessly until you land on the state news channel. The reporter describes a regional emergency in the South of the country that following a chemical plant leak, triggering mass hallucinations and hysteria. The news anchor stares straight at the camera. \"Remain calm, your government cares for you.\" A wave of calmness washes over you, only to be replaced with hollowness.");
            //} else {
            //    this.engine.show("The news channel continues looping the news of the chemical leak. You notice the reporter's eyes darting behind the camera before they quickly regain composure.");
            }
        }

        if (key === "Bedroom" && (!this.engine.state.hasEaten && !this.engine.state.hasWatchedTV)) {
            this.engine.show("You don't feel ready to sleep. Maybe unwind or eat something first.");
        }

        if (key === "Bed") {
            let msg = "You change out of your work clothes and lay in bed, the metal frame creaking underneath your weight. ";
            if (this.engine.state.hasEaten && this.engine.state.hasWatchedTV) {
                msg += "With a full stomach and tired mind, you drift into an uneasy sleep. However, you swear you saw someone standing in your doorway before you closed your eyes...";
            } else if (this.engine.state.hasEaten) {
                msg += "Your stomach is full, but so is your mind. You try to ground yourself by remembering your name...what was it again?";
            } else {
                msg += "You close your eyes, but hunger gnaws at you. You fight through it and drift off to sleep as your stomach growls. What's one skipped meal, right?";
            }
            this.engine.show(msg);
        }

        if (locationData.Choices) { // TODO: check if the location has any Choices
            let choiceAdded = false;

            for (let choice of locationData.Choices) { // TODO: loop over the location's Choices
                const target = choice.Target;

                if (choice.RequiredKey && !this.engine.state[choice.RequiredKey]) {
                    this.engine.show("You reach for your door, trying the handle. It's locked, just how you left it. Checking your pockets, you discover your keys are missing. Great, where could they have gone...");
                    continue;
                }

                if (target === "Bed" && (!this.engine.state.hasEaten && !this.engine.state.hasWatchedTV)) {
                    continue;
                }

                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                choiceAdded = true;
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }

            if (!choiceAdded) {
                this.engine.addChoice("Nothing to do here.", null);
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(!choice) {
            this.engine.gotoScene(End);
            return;
        }

        this.engine.show("&gt; "+choice.Text);
        this.engine.gotoScene(Location, choice.Target);
        
    }
}

class TVScene extends Location {
    create(key) {
        super.create(key);

        if (!this.engine.state.tvViews)
            this.engine.state.tvViews = 0;
        this.engine.state.tvViews++;

        const messages = [
            "The state news network is on, something about a chemical spill in the South of the country.",
            "The news anchor reassures the viewers: \"The government has the situation under control. During such times, we remind the public to trust in our government, they know best.\" You feel a sense of relaxation wash over you like a switch had been flipped only to be followed by hollowness.",
            "The news channel loops the same broadcast... but the anchor's skin looks paler, her eyes colder.",
            "The screen flickers. The government knows best."
        ];

        const msg = messages[Math.min(this.engine.state.tvViews - 1, messages.length - 1)];
        this.engine.show(`<i>${msg}</i>`);
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');