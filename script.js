
// ? Logic 2-99
let posts = []

let mainUserName;
const defaultUserName = "guestUser"

function createPost(username, content,image="Fill-Images/post-image.png"){ 
    
    let firstHashTag;
    let hashTagIndex;
    let hashTags = []; 
    for(let i = 0; i < content.length; i++){
        const char = content[i]

        if (i !== content.length - 1){

            if (char === "#") {
    
                if (hashTagIndex < i) {
                    hashTags.push(content.slice(hashTagIndex,i))
                    hashTagIndex = i
                } else {
                    firstHashTag = i
                    hashTagIndex = i
                }
            }
        } else {
            if (hashTagIndex < i) {
                if ( char !== "#") {
                    hashTags.push(content.slice(hashTagIndex))
                } else {
                    hashTags.push(content.slice(hashTagIndex,i))
                }
            }
        }
    };
    
    content = content.slice(0,firstHashTag)

    let post = {
        id: posts.length + 1,
        username: username,
        content: content,
        hashtags: hashTags,
        comments: [],
        image: image,
        likes: 0,
        timeStamp: localTimeString()
    }
    
    if (!content) {
        throw new Error(`Conent is empty. Id: ${post.id}`)
    }
    
    posts.push(post)
    return post
}

function localTimeString() {
    const date = new Date()
    const datePart = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    })
    const timePart = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    })
    return `${datePart} at ${timePart}`
}

let findPostById = (postId) => {
    let foundPost = posts.filter(post => post.id === postId)
    if (!foundPost.length) {
        console.log("Id Invalid")
        return
    }
    return foundPost[0]
}

function likePost(postId,take=false) {
    let post = findPostById(postId)
    
    if (!take){
        post.likes++
        return
    }
    post.likes--
}

function commentPost(postId,user,commentText) {
    let comment = {
        userName: user,
        content: commentText,
        time: localTimeString()
    }
    let post = findPostById(postId)
    post.comments.unshift(comment)
    return comment
}

const sortFeed = {
    ByLikes(postGroup=posts){
        return postGroup.sort((a,b) => b.likes - a.likes)
    },
    
    ByNewest(postGroup=posts){
        return postGroup.sort((a,b) =>  b.timeStamp - a.timeStamp)
    }
}

function getPostByUser(username,postGroup=posts) {
    let normalizedUsername = username.toLowerCase()
    userPosts = postGroup.filter(post => post.username.toLowerCase() === normalizedUsername)
    return sortFeed.ByLikes(userPosts)
}

// ? retruns a list of posts where the 3 most popular posts have priority and the rest of the posts are sorted by newest to oldest 
function getFeed (postGroup=posts) {
    byLikes = sortFeed.ByLikes(postGroup)
    let hasLikes = postGroup.filter(post => post.likes > 0)
    
    let mostPopular;
    let newest;
    if (!hasLikes.length > 3) {
        mostPopular = byLikes.slice(0,hasLikes.length)
        newest = sortFeed.ByNewest(byLikes.slice(hasLikes.length))
    } else {
        mostPopular = byLikes.slice(0,3)
        newest = sortFeed.ByNewest(byLikes.slice(4))
    }
    
    return mostPopular.concat(newest)
    
}

const searchByHashtag = (inquary,postGroup=posts) => sortFeed.ByLikes(postGroup.filter(post => post.hashtags.includes(inquary))) 
const searchByCaption = (inquary,postGroup=posts) => postGroup.filter(post => post.content === inquary)

const generalSearch = (inquary) => {
    inquary = inquary.toLowerCase()
    let hashTagResults = []
    let userResults = [];
    let captionResults = [];
    posts.forEach(post => {
        post.hashtags.forEach(hashTag => {
            if (hashTag.toLowerCase().includes(inquary)) {
                if(!hashTagResults.includes(hashTag)){
                    hashTagResults.push(hashTag)
                }
            }
        })
        let postUserName = post.username.toLowerCase()
        if (postUserName.includes(inquary)) {
            if(!userResults.includes(postUserName)){
                userResults.push(postUserName)
            }
        }
        let caption = post.content.toLowerCase()
        if (caption.includes(inquary)) {
            captionResults.push({user: post.username, caption: post.content})
        }
    })
    return {hashTagResults: hashTagResults, userResults: userResults, captionResults: captionResults}
}

// ! UI
function getBlankPost () {

    let BlankPost = document.createElement("div")
    BlankPost.classList.add("post-container","d-flex","flex-column")

        let imageTop = document.createElement("figure")
        imageTop.classList.add("post-img-top")
        let image = document.createElement("img")
        imageTop.appendChild(image)
        BlankPost.appendChild(imageTop)
    
    
        let postTitleWrapper = document.createElement("div")
        postTitleWrapper.classList.add("post-title-wrapper","post-row",'d-flex','align-items-baseline')
        let postTitle = document.createElement('h3')
        postTitle.classList.add('post-title')
        let postTime = document.createElement('p')
        postTime.classList.add('post-time','system-text')
        postTitleWrapper.append(postTitle,postTime)

        let hashTagsContainer = document.createElement("span")
        hashTagsContainer.classList.add("hash-tags-container","post-row","d-flex","align-items-baseline", 'divide')
        
        let userName = document.createElement("h3")
        userName.classList.add("user-name","post-row",'divide')
        BlankPost.append(postTitleWrapper,hashTagsContainer,userName)
    
        let postBottomContainer = document.createElement("div")
        postBottomContainer.classList.add("post-bottom","post-row")
        BlankPost.append(postBottomContainer)

        let postActionsContainer = document.createElement("div")
        postActionsContainer.classList.add("post-actions","post-row","d-flex","align-items-baseline","justify-content-between")
        postBottomContainer.appendChild(postActionsContainer)

        let likeContainer = document.createElement("span")
        likeContainer.classList.add("like-container","d-flex","flex-row","align-items-baseline","gap-3")
        
            let likeButton = document.createElement("button")
                likeButton.classList.add("like-button","btn",'primary-hover')
                let likeButtonSvg = document.createElement("i")
                likeButtonSvg.classList.add("fa-regular","fa-thumbs-up")
            likeButton.appendChild(likeButtonSvg)
            
            let numOfLikes = document.createElement("p")
                numOfLikes.classList.add("likes-number")
        likeContainer.append(likeButton,numOfLikes)
        
        let commentButton = document.createElement("button")
            commentButton.classList.add("comment-button","btn",'primary-hover')
            let commentButtonSvg = document.createElement("i")
            commentButtonSvg.classList.add("fa-regular","fa-message")
            
            commentButton.appendChild(commentButtonSvg)
        
        postActionsContainer.append(likeContainer,commentButton)
        
        let commentsContainer = document.createElement("div")
        commentsContainer.classList.add("comment-container","post-row","collapsed")
        let comments = document.createElement("div")
        comments.classList.add('comment-scroll-container')
        commentsContainer.appendChild(comments)
        postBottomContainer.appendChild(commentsContainer)
        
        return BlankPost
}

function getCommentHtml(comment) {
    let singleCommentContainer = document.createElement("div")
    singleCommentContainer.classList.add("post-row","comment",'divide')

    let commentHeading = document.createElement("span")
    commentHeading.classList.add("comment-heading","d-flex","align-items-baseline", "justify-content-start","gap-2")
    singleCommentContainer.appendChild(commentHeading)

    let userName = document.createElement("h6")
    userName.classList.add("comment-user")
    userName.textContent = `@${comment.userName}`
    let commentTime = document.createElement("p")
    commentTime.classList.add("system-text","comment-time")
    commentTime.textContent = comment.time
    commentHeading.append(userName,commentTime)
    let commentBody = document.createElement("div")
    commentBody.classList.add("comment-body","d-flex","align-items-end","justify-content-start")
    singleCommentContainer.appendChild(commentBody)
    let commentText = document.createElement("p")
    commentText.textContent = comment.content
    commentText.classList.add("comment-text","system-text")
    commentBody.appendChild(commentText)

    return singleCommentContainer
}

function getCommentInputElement() {
    let inputWrapper = document.createElement("form")
    inputWrapper.classList.add("comment-input-wrapper","d-flex","justify-content-center")

    let commentTextInput = document.createElement("input")
    commentTextInput.classList.add('comment-input')
    commentTextInput.type = "text"
    commentTextInput.name = "comment-text"
    commentTextInput.placeholder = "Comment here"
    
    let commentAddButton = document.createElement("button")
    commentAddButton.type = "SUBMIT"
    commentAddButton.classList.add("send-comment-button",'btn','accent-hover')
    const commentAddSvg = document.createElement("i")
    commentAddSvg.classList.add("fa-regular","fa-paper-plane")
    commentAddButton.appendChild(commentAddSvg)

    inputWrapper.append(commentTextInput,commentAddButton)

    return inputWrapper
}

function createPostElement(post) {

    let postElement = getBlankPost()
    postElement.id = post.id

    let image = postElement.querySelector("img")
    image.src = post.image

    let postTitle = postElement.querySelector('.post-title')
    postTitle.textContent = post.content
    let postTimeStamp = postElement.querySelector('.post-time')
    postTimeStamp.textContent = post.timeStamp
    

    let hashTagsContainer = postElement.querySelector('.hash-tags-container')
    post.hashtags.forEach(hashTag => {
            let toAdd = document.createElement("p")
            toAdd.textContent = hashTag
            hashTagsContainer.appendChild(toAdd)
        })
        
    let userName = postElement.querySelector('.user-name')    
    userName.textContent = post.username


        let numOfLikes = postElement.querySelector('.likes-number')
        numOfLikes.textContent = post.likes

        let likeButton = postElement.querySelector('.like-button')
        
        let userLiked = false
        likeButton.addEventListener("click", () => {
            let svg = likeButton.querySelector('.fa-thumbs-up')
            if (!userLiked){
                svg.classList.remove("fa-regular")
                svg.classList.add("fa-solid")
                console.log("wentt through")
                likePost(post.id)
                numOfLikes.textContent = post.likes
                userLiked = true
            } else {
                svg.classList.remove("fa-solid")
                svg.classList.add("fa-regular")
                likePost(post.id,true)
                userLiked = false
                numOfLikes.textContent = post.likes
            }
            
        })
        
        let commentsContainer = postElement.querySelector('.comment-container')
        let commentsScrollContainer = postElement.querySelector('.comment-scroll-container')
        post.comments.forEach(comment => {
            commentsScrollContainer.appendChild(getCommentHtml(comment))
        })
        
        let commentButton = postElement.querySelector('.comment-button')
        commentButton.addEventListener("click", () => {
            
            let svg = commentButton.querySelector('.fa-message')
            
                if (commentsContainer.classList.toggle('collapsed')){
                    setTimeout(() => {
                        commentsContainer.querySelector('.comment-input-wrapper').remove()
                    },300)
                    svg.classList.remove('fa-solid')
                    svg.classList.add("fa-regular")
                } else {
                    svg.classList.remove('fa-regular')
                    svg.classList.add("fa-solid")

                    let inputWrapper = getCommentInputElement()
                    commentsContainer.appendChild(inputWrapper)
                    
                    inputWrapper.addEventListener('submit', (event) => {
                        event.preventDefault()
                        
                        let input = inputWrapper.querySelector('[name=comment-text]')
                        let inputValue = input.value
                        
                        if (inputValue.trim() !== "") {
                            let newComment = commentPost(post.id,mainUserName ? mainUserName: defaultUserName,inputValue)
                            let newCommentElmnt = getCommentHtml(newComment)
                            commentsContainer.prepend(newCommentElmnt)
                            console.log(inputValue)
                            input.value = ""
                            console.log(inputValue)
                            }
                    })
                }
            })
    return postElement
}

function showSection(name) {
    const validSections = ['new-post','posts','search','info','settings']

    if (!validSections.includes(name)) return

    const mainElement = document.querySelector('main')
    mainElement.querySelectorAll(':scope > section').forEach((section) => {
        if (section.id !== name) {
            if (!section.classList.contains('hidden')) {
                section.classList.add('hidden')
            }
        }
    })
    let postSection = document.getElementById('posts')
    postSection.replaceChildren()
    if (name === 'posts') {
        renderFeed(getFeed())   
    } 
    let toShow = document.getElementById(name)
    if (toShow.classList.contains('hidden')) {
        toShow.classList.remove('hidden')
    }
}

function renderSearchResults(result) {
    let resultContainer = document.getElementById('search-result-container')
    let getResultWrap = () => {
        let resultWrapper = document.createElement('div')
        resultWrapper.classList.add('d-flex','justify-content-start','align-items-center','search-result')
        return resultWrapper
    }

    result.hashTagResults.forEach(hashtag => {
        let wrapper = getResultWrap()
        let result = document.createElement('h6')
        result.classList.add('hashtag')
        result.textContent = hashtag
        wrapper.appendChild(result)
        wrapper.onclick = () => {
            resultContainer.replaceChildren()
            renderFeed(searchByHashtag(hashtag),resultContainer)
        }
        resultContainer.appendChild(wrapper)
    })
    result.userResults.forEach(user => {
        let wrapper = getResultWrap()
        let result = document.createElement('h4')
        result.classList.add('username')
        result.textContent = `@${user}`
        wrapper.appendChild(result)
        wrapper.onclick = () => {
            resultContainer.replaceChildren()
            renderFeed(getPostByUser(user),resultContainer)
        }
        resultContainer.appendChild(wrapper)
    })
    result.captionResults.forEach(content => {
        let wrapper = getResultWrap()
        let result = document.createElement('p')
        result.classList.add('content')
        result.textContent = `Posted by ${content.user}: ${content.caption}`
        result.classList.add('system-text') 
        wrapper.appendChild(result)
        wrapper.onclick = () => {
            resultContainer.replaceChildren()
            console.log(content)
            renderFeed(posts.filter((post) => post.content === content.caption),resultContainer)
        }
        resultContainer.appendChild(wrapper)
    })
}

let postSection = document.getElementById("posts")
function renderFeed(postGroup=posts,toAdd=postSection) {

    postGroup.forEach((post) => toAdd.appendChild(createPostElement(post)))

}

// * Creating a post
const imageInput = document.getElementById("image-input")
const previewContainer = document.getElementById('preview-container')
let imagePreview = document.getElementById('image-preview')

previewContainer.addEventListener("click", () => {
    imageInput.click()
})
imageInput.addEventListener('change', async function(event)  {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader()

        reader.onload = (e) => {
            imagePreview.src = e.target.result
        }
        reader.readAsDataURL(file)
    }
})

const submitPostBtn = document.getElementById('submit-post')

submitPostBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const givenImage = imagePreview.src
    const typedCaption = e.currentTarget.form[1].value
    const userName = mainUserName ? mainUserName : defaultUserName

    createPost(userName,typedCaption,givenImage)
    imagePreview.src = "Fill-Images/post-image.png"
    e.currentTarget.form[1].value = ""
    showSection('posts')
})

// * Search
let searchBar = document.getElementById('search-bar')
let resultContainer = document.getElementById('search-result-container')
searchBar.addEventListener("input", (ev) => {
    let searchBarValue = ev.currentTarget.value
    if (searchBarValue.length >= 3) {
        resultContainer.replaceChildren()
        renderSearchResults(generalSearch(searchBarValue))
    } else if (searchBarValue.trim() === ""){
        resultContainer.replaceChildren()
    }
})

// * Settings
let darkModeSwitch =document.getElementById('dark-mode-switch')
let body = document.querySelector('body')
darkModeSwitch.addEventListener("click", () => {
    darkModeSwitch.classList.toggle('off')
    body.classList.toggle('dark-mode')
})
// Selecting a user name
let btnContainer = document.querySelector("div.button-container")
btnContainer.addEventListener("click",(event) => {
    if (event.target.localName === "button") {
        if (event.target.id === "username-submit"){
            let usernameInput = document.getElementById("set-user-name-input")
            let inputNameValue = usernameInput.value
            if (inputNameValue.trim() !== "") {
                mainUserName = inputNameValue
            }
        }
        document.getElementById("select-user-name").remove()
        showSection('info')
    }
})



createPost("alexcreates","Happy Fall!#weekend#Fall","Fill-Images/post-wednesday.jpg")
createPost("maya_reads", "Just found my new favorite coffee spot!","Fill-Images/post-coffee.jpg")
createPost("devon_k", "Weekend plans: absolutely nothing, and I'm excited about it.#weekend","Fill-Images/post-weekend.jpg")
createPost("skylar22", "Finally finished that project I've been working on!","Fill-Images/post-project.jpg")
createPost("alexcreates", "Anyone else watching the game tonight?#weekend","Fill-Images/post-game.jpg")
createPost("Jackson", "Reminder to take a break and get some fresh air.","Fill-Images/post-break.jpg")
createPost("Jackson","So excited!#Speachless!","Fill-Images/post-excited.jpg")
createPost("Livy","Welcome to Disney#disneyforlife#fun#weekend","Fill-Images/post-disney.jpg")
createPost("Jas0n23","Look what I bought#ReviewcContent#","Fill-Images/post-purchase.jpg")

const seededPostIds = posts.map(post => post.id)
const postWithoutSeededLikes = seededPostIds[Math.floor(Math.random() * seededPostIds.length)]
seededPostIds.forEach(postId => {
    if (postId === postWithoutSeededLikes) return

    const seededLikeCount = 20 + Math.floor(Math.random() * 21)
    for (let i = 0; i < seededLikeCount; i++) {
        likePost(postId)
    }
})

const starterCommentsByPost = {
    1: ["The fall colors are great!", "Happy fall!", "This is such a good way to start the week.", "Love the autumn vibe.", "Where was this taken?", "Looks peaceful!"],
    2: ["That coffee looks delicious.", "Adding this spot to my list.", "Is the latte art always this good?", "Love finding a new cafe.", "What did you order?", "This place looks so cozy."],
    3: ["That sounds like the perfect weekend.", "Doing nothing is underrated.", "I support this plan.", "Enjoy the quiet time!", "Same plans here.", "Hope you get some good rest."],
    4: ["Congrats on finishing it!", "You did it!", "That must feel great.", "What was the project about?", "Nice work!", "Time to celebrate."],
    5: ["I might watch it!", "Who are you rooting for?", "Game night sounds fun.", "Hope it’s a good one.", "I’ll bring the snacks.", "Which teams are playing?"],
    6: ["A little fresh air helps so much.", "That view is beautiful.", "I needed this reminder.", "Looks like a great place to unwind.", "Nature always helps me reset.", "Where is this trail?"],
    7: ["That looks exciting!", "What a fun day.", "I love the energy here.", "Hope you had the best time!", "This looks like a great memory.", "So cool!"],
    8: ["That castle is beautiful.", "Disney is always magical.", "Which park did you visit?", "I want to go back!", "Such a fun trip.", "Did you ride your favorite attraction?"],
    9: ["That kart looks awesome.", "What a cool purchase!", "Have you tried it out yet?", "Looks fast!", "Where do you take it for a spin?", "That’s a great find."]
}

const starterCommenters = [
    "maya_reads", "devon_k", "skylar22", "alexcreates", "Livy", "jburner", 
    "pixelpanda", "riverstone", "taco_tuesday", "moonlitmoss", "copperfox", 
    "cloudyday", "snackwizard", "mapleleaf", "orbitrunner", "bluejay_ben"
]
Object.entries(starterCommentsByPost).forEach(([postId, comments]) => {
    comments.forEach((comment, index) => {
        commentPost(Number(postId), starterCommenters[index], comment)
    })
})

