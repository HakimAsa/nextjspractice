import cookie from 'cookie'

export function parseCookies(req){
    return cookie.parse(req ? req.headers.cookie || '' : '')
}

//todo creating a generic function for API calls
export function reqAxios(){

}