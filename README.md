# Fluxo
Welcome to Fluxo, the Kanban dasboard for Trello boards.

The application is located at [http://Fluxo.herokuapp.com](http://Fluxo.herokuapp.com)
You can see a demo (with dummy data) of Fluxo at [http://Fluxo.herokuapp.com/demo](http://Fluxo.herokuapp.com/demo/)

##Introduction
Fluxo is a Kanban dashboard for Trello Boards that has 2 parts. 
* The first part is a 3 step configuration that tells 
* the second part what to visualize.

Let's start with the first part!

## Fluxo Configuration
Before you can visualize any Kanban statistics you'll have to tell Fluxo which Trello board and what Trello lists that
make up your Kanban process.

To be able to get your Trello data Fluxo needs to connect to Trello using an account preferred by you. 
This account information will be stored in your client for 30 days and then you've to renew it.

### Step 1 - Connect to Trello
If you've already connected to Fluxo before go directly to Step2.

Before you can use Fluxo you need to connect to Trello using your trello account. 

* Click the here link in the text "To use Fluxo you need to connect To Trello here"

![image](https://raw.githubusercontent.com/hugohaggmark/Fluxo/master/docs/welcome.png)
* the usual connect to Trello dialog should appear, follow this as you would do when connecting to Trello 
* remember to allow Fluxo to read your Trello information
 
### Step 2 - Choose Board
Pretty simple, click on the board that you're interested in getting Kanban statistics for and then click the next step.

![image](https://raw.githubusercontent.com/hugohaggmark/Fluxo/master/docs/step2.png)

### Step 3 - Define flow
Ok so in this step you've to define your Kanban flow. Click on the lists **in the order** you have in your Kanban flow.
leadtime will be calculated from when a card is created to the last step in your Kanban flow. 
Cycletime will be calculated using the other steps in your Kanban flow.

![image](https://raw.githubusercontent.com/hugohaggmark/Fluxo/master/docs/step3a.png)

When you're happy with the order of your Kanban flow click the next step.

![image](https://raw.githubusercontent.com/hugohaggmark/Fluxo/master/docs/step3b.png)

Wow, now a new browser window will open up displaying different Kanban statistics for your chosen Kanban flow. 
* TIPS The link (url) in this new browser window can easily be shared with all members of the chosen board or used in a browser that's displayed on a big screen in your team room.

## Fluxo Visualization
So you manged to configure your Kanban flow? Then you should be looking at something like this:

![image](https://raw.githubusercontent.com/hugohaggmark/Fluxo/master/docs/totals.png)

This is the Totals view and it shows all data for all Trello labels (if you use them). 
The visualization part works as slideshow so every 60 seconds a new label specific view will appear if you have used labels 
on your Trello cards.This could look like this:

![image](https://raw.githubusercontent.com/hugohaggmark/Fluxo/master/docs/label.png)

### Leadtime calculations explained
In this version of Fluxo there is only support for leadtime calculations. 
The leadtime for a specific card is calculated by calculating the difference between when the card is created and when the card reaches 
the final step of your Kanban flow.

All leadtime data is visualized into 2 parts a "widget" and a chart.

#### Leadtime widget
This widget shows your Leadtime Kanban statistics as explained in the picture below:

![image](https://raw.githubusercontent.com/hugohaggmark/Fluxo/master/docs/explained.png)

#### Lead time chart
The chart will show your leadtime over time, a 30 day moving average and a 7 day moving average.

### Throughput calculations explained
To be implemented in future releases

### Cycletime calculations explained
To be implemented in future releases

# Aknowledgements
* Thanks to GitHub (https://github.com/)
* Thanks to Heroku (https://www.heroku.com/)
* Thanks to Trello (https://trello.com/docs/)
* Thanks to JQuery (https://jquery.com/)
* Thanks to BootStrap (http://getbootstrap.com/)
* Thanks to NodeJs (https://nodejs.org/)
* Thanks to MustacheJS (https://mustache.github.io/)
* Thanks to HighCharts (http://www.highcharts.com/)
* Thanks to Simple Moving Average Plugin for HighCharts (https://github.com/laff/technical-indicators)
* Thanks to Bootswatch (https://bootswatch.com/)
* Thanks to Marcus Hammarberg (@marcusoftnet)

# Suggestions
* Max leadtime - what's the longest anything ever took
* Min leadtime - what's the shortest anything ever took
* Throughput (number of items completed / unit of time, week for example)
* Cycle time, maybe not for now, since it will be a bit messy to calcule. We have to ask the user for which cycle we're going to measure. You could also just stack it in a Culumnative Flow Diagram (CFD). That's easier to calculate but harder to read.

* I think that we can do a pretty good visualization as well for leadtime like this:
  * plot a diagram with all the leadtimes on a time-axis
  * add an average line
  * add 1 (or 3?) sigma above
  * add 1 (or 3?) sigma below
# Suggestions
* Max leadtime - what's the longest anything ever took
* Min leadtime - what's the shortest anything ever took
* Throughput (number of items completed / unit of time, week for example)
* Cycle time, maybe not for now, since it will be a bit messy to calcule. We have to ask the user for which cycle we're going to measure. You could also just stack it in a Culumnative Flow Diagram (CFD). That's easier to calculate but harder to read.

* I think that we can do a pretty good visualization as well for leadtime like this:
	* plot a diagram with all the leadtimes on a time-axis
	* add an average line
	* add 1 (or 3?) sigma above
	* add 1 (or 3?) sigma below
