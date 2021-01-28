/* eslint-disable */ 

// Experss * wildcard alongside the 'KEY' path parameter divides the req.params into an object in this way:
//          req.params = { key: ..., '0': .... }
// Swagger validator does not expec to 2 path parameters, so we unite them into one path parameter.

export const parse = (req: any, res: any, next: any) => {
    req.params = { key: req.params.key + req.params[0]};
    next();
};