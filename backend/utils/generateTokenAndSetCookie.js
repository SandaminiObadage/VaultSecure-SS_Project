import JWT from 'jsonwebtoken';
export const generateTokenAndSetCookie = (res, userId) => {
    const token = JWT.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
        
    })
    res.cookie("token", token, {
        httpOnly: true, //cookie cant be accessed by client side
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
});
return token;
}
