# Backlog
  - make user submitted images be added into UserImages and displayed with there post 
    - Half of this is done we already store the name of the img in db now it's mostly front end work

    - NOTE TO IDIOT: src means runs on server, static is browser

  - Reconnect websocket when it disconnects

# In-Progress
  - Add CSS to threads listing page so that it doesn't look so jumbled

  - Add pagination to threads listing page
    - The bottom of page should show the current page number, and have arrows as links using < and >
      - It should look more or less like this: < 3 >
      - If the page is 1, the < shouldn't be a link
      - If the page is the last page, the > shouldn't be a link
      - Otherwise, those links should go to the previous and next pages, respectively
    
    - The URL format should be /threads/:page
    - There is an example of retrieving a route/path param in the thread controller, where we retrieve the thread ID
    - To get the offset based on page number, it should be something like this:
      - `const offset = (pageNum - 1) * pageSize`
    - To get the total number of pages, you do:
      - `const totalPages = Math.ceil(totalPosts / pageSize) + 1`