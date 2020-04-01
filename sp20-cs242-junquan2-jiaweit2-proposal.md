# RedditMovie

Junquan Chen | Moderator: Jiawei Tang (jiaweit2)
This is a mobile app about presenting Reddit users' opinions towards movies for CS242

## Abstract
### project purpose
Through the movie reviews/comments by Reddit users, we can analyze how the movie is accepted by the audiences.

### Project Motivation
- When people want to know the quality of a movie, they usually check the professional sites. However, the movie reviews there are always too professional and can't give users a genuine feeling of how other people think of the movie.
- Comments from social media are realatively easy to understand, so I decide to make an analyzer that can rate the movie based on the reviews from audience on social media.

## Technical Specification
- **Platform**: Cross-Platform app (React Native)
- **Programming Languages**: Python, JavaScript
- **Stylistic Conventions**: CS242 JavaScript Styling Convention
- **SDK**: N/A
- **IDE**: Virtual Studio Code
- Tools/Interfaces: Mobile Devices/EXPO
- Target Audience: Anyone

## Functional Specifications
### Features
- Users can search for any movie with prompt
- Users can check the score of their favorite movie.
- Users can find the top revies for the movie.

### Scope of the Project
- N/A

## Brief Timeline
- **Week1**: 
1. Setting up initial website template
1. Design the data flow of the app
2. Create the login page
3. Create local data storage for the app
4. Testing the app layout
5. Design the schema to represent our database
6. Create database in MongoDB with initial Schema
7. Create model and query document

- **Week2**: 
1. Create the search page
2. Setup connection to database
3. Allow users to register and input personal data
4. Test the interactions in layout
5. Find and test the external film resources API
6. Set up communication between app and outer API 
7. Get info like images and description of the films 
8. Testing the dataflow of the API

- **Week3**:
1. Find and implement the reviews finder
2. Train a model from a corpus and build a binary classifier to determine good or bad reviews
3. Testing the reviews quality
4. Filter out irrelevant reviews
5. Create the analysis page
6. Implement the movie prompt
7. Testing the layout and API

- **Week4**:
1. Create Home page for user which shows their favorite movies scores develop evaluation metrics to give a score
2. Testing layout and data analysis for some good and bad movies
3. Create Home page for guest which shows the movies with top scores Find out the most useful reviews to show
4. Testing layout and data analysis for some positive and negative reviews


## Rubrics
### Week1
| Category | Total score Allocated | Detailed Rubrics |
|:---:|:---:|---|
| Function - Login and registration page | 5  | 0: Didn't implement anything<br> 2.5: Allow users to enter username and password. Have a clear and designed layout <br> 5: Allow users to create a new account/ navigate to the registration page.|
| Function - Search bar and favorite  | 5  |  0: Didn't implement anything<br> 2.5: Have the search bar ready for the input<br> 5:Also create the list view in favorites| 
| Function - MongoDB  | 5  | 0: Didn't implement anything<br> 2.5: Set up MongoDB on a server<br> 5:Connect to MongoDB to fetch and store the data |
| Testing - Manual  |  10 | 0: Didn't implement anything<br> 10: Test manual covering all features, have 10+pages in total|

### Week2
| Category | Total score Allocated | Detailed Rubrics |
|:---:|:---:|---|
|  Function - Movie Database | 3  |  0: Didn't implement anything<br> 1.5: Investigate available movie database api to help fetch useful data to present<br> 3: set up with movie database endpoint|
|  Function - Search | 4  | 0: Didn't implement anything<br>  2: Can search for specific movie<br> 4: Searching can work in real-time and suggest the movies while you type |
|  Function - Cinema page | 4  | 0: Didn't implement anything<br> 4: Allow users to get movies from recent 4 years and users can click the movie to enter the movie info page|
|  Function - Movie Info page | 4  | 0: Didn't implement anything<br>  2: Design and set up basic movie info page that should show descriptions, title, scores and best reviews for that movie<br> 4: Ensure every page can navigate to the movie info page and then navigate back |
| Testing - Manual  |  10 | 0: Didn't implement anything<br> 10: Test manual covering all features, have 10+pages in total|

### Week3
| Category | Total score Allocated | Detailed Rubrics |
|:---:|:---:|---|
| Function - Fav Page | 3 | 0: Didn't implement anything<br>  3: Can favorite movie and unfavorite movie be shown with the correspinding change in database |
|  Function - Movie info page | 4  | 0: Didn't implement anything<br>  2: Interact with our own API to display reviews and scores on this page<br> 4: Each displayed review is linked to correct corresponding page |
| Function - Account page | 4 | 0: Didn't implement anything<br>  2: Allow users to view their account info, change avatar and check for favorite moviews<br> 4: Allow users to modify their account infomation including name, email, bio and password |
| Function - Scoring Algorithm| 4 | 0: Didn't implement anything<br> 2: Train the model & implement sentiment analysis on the fetched data to give score<br> 4:present the score |
| Testing - Manual  |  10 | 0: Didn't implement anything<br> 5: Test manual covering all features, have 10+pages in total<br> 10: All functions can be used and are functioning on mobile device|
