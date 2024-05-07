const tasks = [
    {
        id: 1,
        title: 'Buy cheeze',
        flag: 'B'
    },
    {},
    {},
    {},

]

const tagList = document.querySelector('.task-card-tag-list');
const tagItems = tagList.querySelectorAll('.task-card-tag-item');

if (tagList.scrollWidth > tagList.clientWidth) {
    const numberOfTags = tagItems.length;

    for (let i = 0; i< tagItems.length; i++) {
        tagItems[i].classList.add('cancel-comma')
    }
    for (let i = 2; i < tagItems.length; i++) {
        tagItems[i].classList.add('visually-hidden');
    }

    tagItems[1].textContent = `+${numberOfTags - 1}`;
}