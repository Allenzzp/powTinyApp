# powTinyApp
Refactor tinyApp project and add features

Routes are ordered from most specific to least specific

## To Do Lists
- [ ] Implement all features as required by tinyApp project
- [ ] Implement the Unique visitors tracking feature --- set up additional cookie
- [ ] Allow users to generate a QR code based on given longURLs

## Route Logic

- GET /urls --- display all URLs and shortened forms a user created
- GET /urls/:shortURL --- displays a short/long URL pair
- GET /urls/new --- allows user to create a new shortURL by entering a longURL 
- urls_new.ejs submit button --- send post request to /urls
- POST /urls --- create a new short/long URL pair --- redirect to urls/:shortURL
- GET /u/:shortURL --- redirect to corresponding longURL

