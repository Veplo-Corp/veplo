
export const imageKitUrl = (/* googleUrl */imageUid: string | undefined | null, width?: number, height?: number): string => {
  if (!imageUid) {
    return ''
  }
  if (typeof width !== 'undefined' && typeof height !== 'undefined') {
    const imageKitUrlBase = 'https://ik.imagekit.io/veploimages/'
    return imageKitUrlBase + imageUid + `?tr=w-${width},h-${height}`
  } else {
    const endpoint = 'https://veplo-images.fra1.digitaloceanspaces.com'/* https://spaceprova1.fra1.cdn.digitaloceanspaces.com/ */
    return endpoint + '/' + imageUid
  }
  // return googleUrl.replace(
  //     `https://firebasestorage.googleapis.com/v0/b/dintorni-${process.env.ENV === 'production' ? 'prod' : 'dev'}.appspot.com`, 'https://ik.imagekit.io/veplo')
  //     + `?tr=w-${width},h-${height}`
}