export function register(req, res) {
  res.send('Register Controller')
}

export function login(req,res) {
    res.json({
    msg : 'Login Controller',
    body : req.body
  })
}

