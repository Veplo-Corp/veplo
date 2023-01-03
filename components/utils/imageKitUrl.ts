
export const imageKitUrl = (googleUrl:string, width: number, height: number) => {
    return googleUrl.replace(
        `https://firebasestorage.googleapis.com/v0/b/dintorni-${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}.appspot.com`, 'https://ik.imagekit.io/veplo') + `&tr=w-${width},h-${height}`
  }