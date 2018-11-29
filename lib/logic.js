module.exports = {
	nand(a, b) { return !(a && b) },
	not(a) { return this.nand(a, a) },
	and(a, b) { return this.not(this.nand(a, b)) },
	or(a, b) { return this.nand(this.not(a), this.not(b)) },
	nor(a, b) { return this.not(this.or(a, b)) },
	xor(a, b) { return this.and(this.nand(a, b), this.or(a, b)) },
	xnor(a, b) { return this.not(this.xor(a, b)) }
};