import { Gender } from './enums/gender.enum';

// type Player = {
//     gender: string;
//     [skill: string]: any;
// };

export class Player {
    static maxId = -1;
    id = -1;
    documentId?: string;

    constructor(...args: any[]);
    constructor(
        public isActive: boolean, // isEnabled has to be first in order, it has special logic according to that (can be set false if player doesn't join for recent games)
        public name: string, // name has to be second in order, it has special logic according to that
        public gender: Gender, // gender has to be second in order, it has special logic according to that
        public height: number, // 1-10 (150cm = 1, each 10cm += 2, 190cm = 10)
        public serving: number, // 1-10
        public hitting: number, // 1-10
        public blocking: number, // 1-10
        public defense: number, // 1-10
        public passing: number, // 1-10
        public teamPlayer: number, // 1-10
        public nonQuitter: number, // 1-10
        public servingFlawless: number, // 1-10
        public hittingFlawless: number, // 1-10
        public attackReception: number, // 1-10
        // public communication: number, // 1-10
    ) {
        if (name) {
            this.id = ++Player.maxId;
        }
    }

    static getPlayerClassAllProperties() {
        return Object.keys(Reflect.construct(Player, []));
    }

    static getPlayerClassPropertiesExceptId() {
        const playerProperties = Player.getPlayerClassAllProperties();
        return playerProperties.slice(0, playerProperties.length - 1); // remove id property from the end
    }

    static getPlayerClassSkillProperties() {
        const playerProperties = Player.getPlayerClassAllProperties();
        return playerProperties.slice(3, playerProperties.length - 1); // remove isActive, name and gender properties from beginning and id property from the end
    }

    static getTeamOverall(team: Player[], teamSize?: number) {
        const overall = team.reduce((accumulator, player) => {
            return accumulator + player.getPlayerOverall();
        }, 0) / (teamSize ? teamSize : team.length);
        return isNaN(overall) ? 0 : overall;
    }

    getPlayerOverall() {
        let totalSkillWeight = 0;
        let overall = 0;
        const skillList = Player.getPlayerClassSkillProperties();
        skillList.forEach(skill => {
            const skillWeight = playerPropertyWeightMap.get(skill) ?? 1;
            totalSkillWeight += skillWeight;
            overall += this.getSkillValue(skill as keyof Player) * skillWeight;
        });
        overall = overall / skillList.length / (totalSkillWeight / skillList.length);
        return overall;
    }

    getPlayerLabelOverall(skills: string[]) {
        let labelOverall = 0;
        skills.forEach(skill => {
            labelOverall += this.getSkillValue(skill as keyof Player);
        });
        labelOverall = labelOverall / skills.length;
        return labelOverall;
    }

    // getSkillValueWithWeight(skill: string) {
    //     return this.getSkillValue(skill as keyof Player);
    // }

    getSkillValue(skill: keyof Player) {
        return this[skill] as number ?? 0;
    }
}

// 1-10
export const playerPropertyWeightMap = new Map<string, number>([
    ['overall', 10],
    ['gender', 10],
    ['height', 10],
    ['serving', 10],
    ['hitting', 8],
    ['blocking', 6],
    ['defense', 8],
    ['passing', 8],
    ['teamPlayer', 6],
    ['nonQuitter', 6],
    ['servingFlawless', 10],
    ['hittingFlawless', 10],
    ['attackReception', 10],
]);

export const playerLabelSkillMap = new Map<string, string[]>([
    ['attacker', ['serving', 'hitting']],
    ['defender', ['defense', 'attackReception']],
    ['blocker', ['height', 'blocking']],
    ['passer', ['passing', 'attackReception']],
    ['server', ['serving']],
]);

// TODO: Use these to calibrate skills and calculate overall
export const skillFlawlessMap = new Map<string, string>([
    ['serving', 'servingFlawless'],
    ['hitting', 'hittingFlawless'],
]);


/*
i am trying to create balanced volleyball teams with my application. I have player list and each player have following specialities:
height
serving
hitting
blocking
defense
passing
I want put weight between 1 and 5 for each of these when I calculate the similar teams. How should be the good weights for each skill to have the best volleyball team
by the way, we are playing amoung the friends. so we are not so proffessional
*/

/*
Experience Level: Assessing each player's overall experience with volleyball can be a significant factor. Beginners, intermediate, and advanced players all bring different skills to the table.

Stamina/Endurance: Volleyball can be physically demanding. Knowing who can play longer without tiring could be useful for balancing teams, especially in longer matches.

Speed/Agility: This is about how quickly and effectively a player can move around the court. It's important for defense, as well as transitioning from offense to defense.

Teamwork/Communication: Some players are natural at communicating and working well in a team setting. This can be a huge asset in a team sport like volleyball.

Game IQ/Strategy Understanding: Some players might have a good understanding of game strategies and tactics, even if they aren't the most physically skilled.

Consistency: Assess how consistently a player performs. Some might have great skills but lack consistency in their performance.

Serving Accuracy: Different from serving power, this measures how accurately a player can place their serves.

Flexibility/Adaptability: Players who can adapt to different positions or roles can be valuable for a well-rounded team.

Leadership: Players who have a positive influence on their teammates and can lead by example or through encouragement can be a key asset.

Competitive Spirit: In a casual setting, it's also important to balance out the competitive spirit of the players to keep the games friendly yet engaging.

Positional Specialization: Some players might be specialized in certain positions (like setter, libero, outside hitter), which can be crucial for team dynamics.

Serve Reception: This is the ability to effectively handle the opposing team's serve and set up your team for a return. It's a crucial skill, especially for back-row players.

Jumping Ability: While height is one factor, some players have a natural ability to jump high, which is useful for spiking and blocking.

Mental Toughness/Resilience: The ability to stay focused and not get discouraged by setbacks or mistakes during the game.

Court Awareness: Understanding where everyone is on the court, both teammates and opponents, which is key for making smart plays.

Reaction Time: How quickly a player can react to unexpected plays or fast-moving balls can be crucial, especially in defense.

Energy Level/Enthusiasm: Some players bring a high level of energy and enthusiasm to the game, which can be contagious and boost team morale.

Specialized Skills: Specific skills like a jump serve, a slide attack, or a strong tip can add variety to the team's play style.

Tactical Serving: Beyond just serving power and accuracy, some players are good at strategically placing their serves to challenge specific opponents or exploit weaknesses.

Decision Making: The ability to make quick, smart decisions during play, such as choosing whether to set, pass, or try for a difficult dig.

Offensive Creativity: Players who can think outside the box and create scoring opportunities in unconventional ways.

Adaptability to Different Play Styles: Players who can quickly adapt to the different play styles of their teammates and opponents.

Physical Fitness: General physical fitness, including endurance and strength, contributes to overall performance.

Sportsmanship: Maintaining a positive attitude, respecting opponents, and playing fair are crucial for a fun and respectful game environment.

In-Game Adaptability: Some players excel at adjusting their play style in response to the dynamics of the game. This can be especially important in matches where strategy needs to change on the fly.

Spatial Awareness: The ability to understand and utilize the space on the court effectively. This includes positioning for spikes, blocks, and defensive plays.

Serve Return Quality: Beyond just receiving serves, how effectively a player can turn a serve receive into a high-quality set-up for an attack.

Footwork: Good footwork is essential for efficient movement on the court, aiding in both offensive and defensive plays.

Pressure Handling: Some players perform exceptionally well under pressure, maintaining composure during crucial points of the game.

Versatility: Players who can play multiple positions effectively offer flexibility in team formation.

Ball Control: Fine control over the ball, especially in terms of setting or directing the ball to specific areas with precision.

Game Sense: An intuitive understanding of the game, including anticipating opponents' moves and understanding the flow of the game.

Warm-Up and Cool-Down Attitude: Players who take warm-ups and cool-downs seriously often are more prepared and less prone to injuries.

Injury History/Physical Constraints: Considering any current or past injuries is important for player safety and team balance.

Situational Awareness: Recognizing and exploiting specific situations in a game, such as a weakness in the opposing team's formation.

Emotional Intelligence: The ability to maintain emotional balance, understand teammates' emotions, and contribute to a positive team environment.

Play Calling/Leadership in Plays: Some players are natural at calling plays and making strategic decisions during the game.

Recovery Skills: The ability to recover quickly from a dive or a fall, which is important for maintaining momentum during fast-paced rallies.

Chemistry with Other Players: Sometimes, certain players just play better together. Understanding these dynamics can be key for team synergy.

Rotational Awareness: Understanding the rotational positions and responsibilities, especially in systems like 6-2 or 5-1.

Serving Variety: Ability to perform different types of serves (float, jump serve, topspin) effectively.

Blocking Technique: Not just height and jumping ability, but also timing and hand positioning for effective blocking.

Setting Skills: For non-setters, the ability to provide a good set can be crucial in out-of-system plays.

First Contact Quality: The ability to effectively handle the first contact after a serve or attack, which is crucial for setting up the offense.

Off-Ball Movement: How well a player moves and positions themselves when they are not directly involved in the play.

Reading the Opponent: The ability to read and predict the opponent's moves, such as where a hitter is likely to spike.

Spike Placement: Beyond power in hitting, the accuracy and strategic placement of spikes.

Serve-Receive Formation Knowledge: Understanding different serve-receive formations and their purposes.

Diving and Rolling: Skills in safely and effectively diving for balls or rolling after a play to minimize injury and maintain play.

Timeout Usage: Understanding when and how to effectively use timeouts (for player-lead teams).

Warm-Up Leadership: Players who lead or energize team warm-ups, setting a positive tone for the match.

Fitness Level: General conditioning that contributes to performance throughout the match, including resistance to fatigue.

Coolness Under Pressure: Ability to perform key skills effectively during high-pressure moments or close games.

Reflexes and Reaction Time: Quick reflexes for responding to fast-paced plays, blocks, and spikes.

Double Play Skills: Ability to handle or avoid double hits, especially in setting or receiving.

Sideline Support: When not on the court, how players contribute through encouragement and advice.

Situational Substitution Understanding: Knowledge of when and why to substitute players based on the game situation.

*/































/*

i have below skill list for voleyball players. I want to label players according to skill values. for example, if serving, hitting, height are high, i can call that player as attack player. or blocking and attackReception is high, then i call that player as defense player. those were just an example. ı want you to help me to decide label categories and which skills should related with label category
This is the skill list:
height
serving
hitting
blocking
defense
passing
teamPlayer
nonQuitter
servingFlawless
hittingFlawless
attackReception
ChatGPT
Creating label categories for volleyball players based on their skill values is a great way to organize and understand player roles within a team. To do this, we can align the skill sets with the typical roles or positions in volleyball and define categories that reflect the various dimensions of playing the game. Here's a suggestion on how to categorize the players based on the skills you've listed:

1. Attack Specialist
Primary Skills: Serving, Hitting, ServingFlawless, HittingFlawless
Secondary Skills: Height (advantageous for attacking positions)
Description: Players who excel in serving and hitting, particularly those who can serve and hit with few errors (flawless skills), can be classified as Attack Specialists. Their ability to consistently put the opposition under pressure with powerful serves and spikes makes them key offensive assets.
2. Defensive Specialist
Primary Skills: Defense, Blocking, AttackReception
Secondary Skills: Passing
Description: Players with high defense, blocking, and attack reception skills are crucial for a team's defensive strategy. They excel in intercepting the opposition's attacks and turning the tide in favor of their team.
3. All-Rounder
Primary Skills: TeamPlayer, NonQuitter
Secondary Skills: Balanced skills across Serving, Hitting, Blocking, Defense, Passing
Description: All-Rounders are players who may not be the top in a single skill but have a well-rounded skill set and exhibit great teamwork and resilience. Their versatility allows them to adapt to various roles as needed.
4. Playmaker
Primary Skills: Passing, TeamPlayer
Secondary Skills: Defense, AttackReception
Description: Players who excel in passing and teamwork, with good defense and attack reception skills, can be seen as Playmakers. They are adept at setting up plays and ensuring the ball is in the right place at the right time for attackers.
5. Blocking Specialist
Primary Skills: Blocking, Height
Secondary Skills: Defense, AttackReception
Description: Players who are tall and excel at blocking can be classified as Blocking Specialists. Their height gives them an advantage at the net, making it difficult for opponents to hit past them.
6. Service Specialist
Primary Skills: Serving, ServingFlawless
Secondary Skills: TeamPlayer
Description: Players who excel in serving, especially those who can deliver flawless serves, play a critical role in starting rallies on a high note and putting the opposing team under immediate pressure.
Each player might exhibit strengths in multiple categories, but categorizing them according to their strongest skill sets can help in strategizing and utilizing their abilities effectively within the team. This approach ensures that a player's contribution is maximized in areas where they are most proficient.

*/












































// https://www.fivb.com/en/volleyball/vis







// give me a typescript algorithym which choose matching two players among from 12 players. Players have gender, serving skill, blocking skill, hit skill. That two players should be best similar among from the others. Similarities should be calculated by each attribute from players







// https://pokeautobuilder.com/
// https://journals.tubitak.gov.tr/cgi/viewcontent.cgi?article=1112&context=elektrik