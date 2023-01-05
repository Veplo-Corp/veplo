
export const imageKitUrl = (/* googleUrl */imageUid:string, width: number, height: number) => {
    const imageKitUrlBase = 'https://ik.imagekit.io/veplo/'
    return imageKitUrlBase + imageUid + `?tr=w-${width},h-${height}`
    // return googleUrl.replace(
    //     `https://firebasestorage.googleapis.com/v0/b/dintorni-${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}.appspot.com`, 'https://ik.imagekit.io/veplo')
    //     + `?tr=w-${width},h-${height}`
  }