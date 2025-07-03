export default function (req,res) {
	res.status(404).json({ msg: 'Service not found'})
}
