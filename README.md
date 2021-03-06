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

- urls_index.ejs delete button --- send post request to /urls/:shortURL/delete

- POST /urls/:shortURL/delete --- delete corresponding short/long URL pair and redirect to /urls

- urls_index.ejs edit button --- send GET request to /urls/:shortURL

- urls_show.ejs update button --- send post request to /urls:shortURL/update

- POST /urls/:shortURL/update --- update a new long URL and redirect to /urls

## Permission
- Login then redirect to /urls
- Users can only see own shortened URLs
- Users can only edit or delete own URLs
- Only registered users can shorten URLs
- URLs belong to users (in /urls, only display URLs created by this user)
- Anyone can visit an existed short URLs through GET /u/:shortURL
- Security for edit/delete URL:
  - check Login staus
  - check shortURL exist or not
  - check does the user own this URL
  - implement task

## Unique Visitors
- current cookie session --> userId determines whether login or not
- for each shortURL, holds a unique visitors' array[] 
- save another cookie session --> visitId
- LOGIC: 
  - if a visitor has visitId, then check is Id in unique visitors' array[]
    - if yes, do nothing; else, add into array
  - if a viitor has no visitId, generated a new one for him/her
    - add into array

  

