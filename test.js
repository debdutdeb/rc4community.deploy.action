const {NodeSSH} = require('node-ssh')

ssh = new NodeSSH()

async function main() {
	try {
		await ssh.connect({
			host: '172.104.207.151',
			username: 'root',
			privateKey: `-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn\nNhAAAAAwEAAQAAAYEAyqLmgzaKULv+KTG4AKuVfl9sQdj9UfnaEP2IIxq1F/wRX/Bh9TKs\nqeEDOD8nGD9JQDg451z7IDFTQpwURZOOI/6WxjSbHqC7qrLGaAeBm1mPUyinl8wScnD41D\nLoXIbCBOJ9KNOj2ue1k+1kLA/INTSy5mNfqnfs10AQLNTsDYujMMhM1vHwiSjb4DKImKCk\nXHm8mDckD3i46jng+o7vEeYENO2SlUbFqwCDd5b/FcSxetGzEt4qo9c5AnYSZTHHIrl70G\neVZ75u4FadjDX0LrnDKFqT8UTBBggFAWR7FBfTcw/s7nNpQohS4zgFFQjBwwNkw9NfZ0tk\nrX2BvmIDk8ALlPCQ2uyNgYPOXZgYOBcoN+c3GmIXjOc+i9SfqNJLlrePTfwQdIlJOO1hsT\nCVhf3Mj3K4WTPsN4YEr7xcEIYlJe4SsEER1VWzLEC6/AQdaXG/iHFuuz41pVdgVZJHhTtA\nLwCOZz2Ay3eGpA5/hrqbmt3pr1XA2KaDBtJt8zRLAAAFiPUfC/n1Hwv5AAAAB3NzaC1yc2\nEAAAGBAMqi5oM2ilC7/ikxuACrlX5fbEHY/VH52hD9iCMatRf8EV/wYfUyrKnhAzg/Jxg/\nSUA4OOdc+yAxU0KcFEWTjiP+lsY0mx6gu6qyxmgHgZtZj1Mop5fMEnJw+NQy6FyGwgTifS\njTo9rntZPtZCwPyDU0suZjX6p37NdAECzU7A2LozDITNbx8Iko2+AyiJigpFx5vJg3JA94\nuOo54PqO7xHmBDTtkpVGxasAg3eW/xXEsXrRsxLeKqPXOQJ2EmUxxyK5e9BnlWe+buBWnY\nw19C65wyhak/FEwQYIBQFkexQX03MP7O5zaUKIUuM4BRUIwcMDZMPTX2dLZK19gb5iA5PA\nC5TwkNrsjYGDzl2YGDgXKDfnNxpiF4znPovUn6jSS5a3j038EHSJSTjtYbEwlYX9zI9yuF\nkz7DeGBK+8XBCGJSXuErBBEdVVsyxAuvwEHWlxv4hxbrs+NaVXYFWSR4U7QC8Ajmc9gMt3\nhqQOf4a6m5rd6a9VwNimgwbSbfM0SwAAAAMBAAEAAAGBAIQn1drBmVeqI8rOCEk3npn6te\noEEMKEBvqJv13Vr0HjPZmqdtipof5xJ95pIaAotidSA5qxA38tbDXHAVmXMF69Tawa5wgE\noCBl1AxIyPh+YoFDxHm1uFo237HVOcIOiT8ST7puvTCpabz+WBR8foBkzECBkwTkjeycdX\nAntYPoDBhmqeaNh+iMY0pG6ttP+aHuK1fCrpwAiekIsnf2/GhZ8WhrgOwmaghqn1NBgT+7\nNlz5oqatinWsihvW0Yx591KxSh+70AvY0t9M6TfJc8+sv6zu4ipN9x/j0b8A7813lDHAbK\nuaC+n501yhGi9gtihAXr+M1BcaueGGKtYy6+7GLCTshs9CaA6iqN7wXi0DIVb5+TGtc56O\nDzk5c8Tw9N3620Pt5RNdrFZkwH8e3Op/Tj93kagn5UidErjXWkNFgYMuGP9EI6YlepMOnz\nunuLNGd7c8VdoMgLMUiO+DRnqoK5zeoenV4cOTebfbS2Cwc8PIKEuo8G2cL+nSHE0W4QAA\nAMBZB9qSrEgfI8C7/V3D7XBkCtczhQvXncIQkTTVVDMsDUzTCgwVoJifAe/YA4iJ3eoLda\nPvauomQw0dnO9L06YBxUacQOyZFZDhAW8R5HLqAJ0ubMNEWw516vkLSkT5Z7qASRiiBUUq\ngvlzp7Jo1hQ/+H22cSuq4Cz5PvlxkVIATSmjwaTAE15K/XlNT6oCm1f2fuRErKvXB/1ok2\nO2OW+iRLgYX9RuwaTiwwjyYb5/zaqY38Nt2O/RdxeKt9e72XsAAADBAOqL1RQsKPj/k4C4\nQKjWv1XAn07ABnFdSGIxdm4Uraxhz0cc4DUAuEw3JIlLSHsBc6ZFmQ+b4GN6dwo6wkFNlz\nQ84KjdOB2b+nE9zgii+TA6k9XYMbN2Hsg6ryuEdt5FViEEqVAclz+w294poFDERjvHQBHE\nCBaC5p9sZKB57NFILAlJY15fZ8X3C+pP+Q7cPTa8BjiN7Y1uuu/YiFd6GBlC4dZq7R55d9\n35dHeVyy9OljQ7I/fEEYnINAimeiBSaQAAAMEA3Svcj+YWah3SKTlUgsIqhuornT0rx/G3\ncisLwu9/4zd2Nt7TrlPM+wa/mqTJcKwTtakEtjhD0+t3rjWIfdLsFNj6iHSXsIzL1kqgyn\nyPNFG+HeERt+gqrA84HVXX5UuIEDQkimC+Qccw/iM+1PgaSY2L9ZFbiSddQJersQuf7OON\nUnRikz5HfxDVnM4KhD1Bgh9lNdirUXgpOCdEKUn4Keo4S4Ob8FnhdeyUgfJObO/enKxCVY\nnsBoxjWEnWxJKTAAAAC2RlYmR1dEBWZW5uAQIDBAUGBw==\n-----END OPENSSH PRIVATE KEY-----`,
			tryKeyboard: false
		})
	} catch (e) {
		console.error(e)
		process.abort()
	}
	console.log('connected')
	console.log('something else')
	process.exit(0)
}

main()
