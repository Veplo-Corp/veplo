

const addAWSPath = (imageUid: string) => {
    const path = 'https://veploimg.fra1.cdn.digitaloceanspaces.com'/* https://spaceprova1.fra1.cdn.digitaloceanspaces.com/ */
    const url = path + '/' + imageUid

    return url

}

export default addAWSPath