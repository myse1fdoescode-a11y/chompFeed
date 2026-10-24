
// ? Logic 2-99
let posts = []

let mainUserName;
const defaultUserName = "guestUser"

function createPost(username, content,image){ 
    
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
        image: image ? image: "Fill-Images/post-image.png",
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
                hashTagResults.push(hashTag)
            }
        })
        let postUserName = post.username.toLowerCase()
        if (postUserName.includes(inquary)) {
            if(!userResults.includes(postUserName)){
                userResults.push(postUserName)
            }
        }
        if (post.content.includes(inquary)) {
            captionResults.push(post.content)
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
    
    
        let postTitle = document.createElement("h3")
        postTitle.classList.add("post-title","post-row")

        let hashTagsContainer = document.createElement("span")
        hashTagsContainer.classList.add("hash-tags-container","post-row","d-flex","align-items-baseline")
        
        let userName = document.createElement("h3")
        userName.classList.add("user-name","post-row")
        BlankPost.append(postTitle,hashTagsContainer,userName)
    
        let postBottomContainer = document.createElement("div")
        postBottomContainer.classList.add("post-bottom","post-row")
        BlankPost.append(postBottomContainer)

        let postActionsContainer = document.createElement("div")
        postActionsContainer.classList.add("post-actions","post-row","d-flex","align-items-baseline","justify-content-between")
        postBottomContainer.appendChild(postActionsContainer)

        let likeContainer = document.createElement("span")
        likeContainer.classList.add("like-container","d-flex","flex-row","align-items-baseline","gap-3")
        
            let likeButton = document.createElement("button")
                likeButton.classList.add("like-button","btn")
                let likeButtonSvg = document.createElement("i")
                likeButtonSvg.classList.add("fa-regular","fa-thumbs-up")
            likeButton.appendChild(likeButtonSvg)
            
            let numOfLikes = document.createElement("p")
                numOfLikes.classList.add("likes-number")
        likeContainer.append(likeButton,numOfLikes)
        
        let commentButton = document.createElement("button")
            commentButton.classList.add("comment-button","btn")
            let commentButtonSvg = document.createElement("i")
            commentButtonSvg.classList.add("fa-regular","fa-message")
            
            commentButton.appendChild(commentButtonSvg)
        
        postActionsContainer.append(likeContainer,commentButton)
        
        let commentsContainer = document.createElement("div")
        commentsContainer.classList.add("comment-container","post-row","collapsed")
        postBottomContainer.appendChild(commentsContainer)
        
        return BlankPost
}

function getCommentHtml(comment) {
    let singleCommentContainer = document.createElement("div")
    singleCommentContainer.classList.add("post-row","comment")

    let commentHeading = document.createElement("span")
    commentHeading.classList.add("comment-heading","d-flex","align-items-baseline", "justify-content-start","gap-2")
    singleCommentContainer.appendChild(commentHeading)

    let userName = document.createElement("h6")
    userName.classList.add("comment-user")
    userName.textContent = comment.userName
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
    commentTextInput.name = "comment-text"
    commentTextInput.placeholder = "Comment here"
    
    let commentAddButton = document.createElement("button")
    commentAddButton.type = "SUBMIT"
    commentAddButton.classList.add("send-comment-button")
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
        post.comments.forEach(comment => {
            commentsContainer.appendChild(getCommentHtml(comment))
        })
        
        let commentButton = postElement.querySelector('.comment-button')
        commentButton.addEventListener("click", () => {
            
            let svg = commentButton.querySelector('.fa-message')
            
                if (commentsContainer.classList.toggle('collapsed')){
                    commentsContainer.querySelector('.comment-input-wrapper').remove()
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
        console.log(section)
        if (section.id !== name) {
            if (!section.classList.contains('hidden')) {
                section.classList.add('hidden')
            }
        }
    })
    let toShow = document.getElementById(name)
    if (toShow.classList.contains('hidden')) {
        toShow.classList.remove('hidden')
    }
}

function renderFeed(postGroup=posts) {
    let postSection = document.getElementById("posts")
    postSection.classList.add('post-section',"d-flex",'flex-column')
    document.querySelector('main').appendChild(postSection)

    postGroup.forEach((post) => postSection.appendChild(createPostElement(post)))

}

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

// * Create post
const submitPostBtn = document.getElementById('submit-post')

submitPostBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const givenImage = imagePreview.src
    const typedCaption = e.currentTarget.form[1].value
    const userName = mainUserName ? mainUserName : defaultUserName

    createPost(userName,typedCaption,givenImage)
})

// * Search
let searchBar = document.getElementById('search-bar')
searchBar.addEventListener("keydown", (ev) => {
    if (ev.currentTarget.value.length > 4) {

    }
})

let main = document.querySelector("main")

let firstPost = createPost("My name","What up bro!#weekend#excited")
console.log(firstPost)
commentPost(firstPost.id,"Jackson","I'm loving your content!")
createPost("maya_reads", "Just found my new favorite coffee spot!")
createPost("devon_k", "Weekend plans: absolutely nothing, and I'm excited about it.#weekend")
createPost("skylar22", "Finally finished that project I've been working on!")
createPost("alexcreates", "Anyone else watching the game tonight?#weekend")
createPost("Jackson", "Reminder to take a break and get some fresh air.")
createPost("Jackson","So excited!#Speachless!")
createPost("Livy","Welcome to Disney#disneyforlife#fun#weekend")
createPost("Jas0n23","Look what I bought#ReviewcContent#")
// let element = createPostElement(firstPost)
// console.dir(element)
// let postSection = document.createElement("section")
// postSection.classList.add("posts","d-flex","flex-colomn")
// postSection.appendChild(element)

// main.appendChild(postSection)

