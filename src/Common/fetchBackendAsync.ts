
export async function fetchBackendAsync(method: string, url: string, headers: {}, body: any = null): Promise<Response> {
    let params: RequestInit = {
        headers: headers,
        method: method,
        credentials: "include"
    };
    // don't set body to null cuz this unsets some browsers, like specific edge versions
    if (body !== null)
        params.body = JSON.stringify(body);
    return await fetch(url, params);
}