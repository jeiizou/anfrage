export async function getResponse(fetchResult: Response, responseType: string) {
    switch (responseType) {
        case 'json':
            return fetchResult.json();
        case 'text':
            return fetchResult.text();
        case 'arrayBuffer':
            return fetchResult.arrayBuffer();
        case 'formData':
            return fetchResult.formData();
        case 'blob':
            return fetchResult.blob();
        default:
            return fetchResult.body;
    }
}
