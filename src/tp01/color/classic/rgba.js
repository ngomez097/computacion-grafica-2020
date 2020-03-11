class RGBA{
    onstructor(r,g,b,a){
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }

    get vec3(){
        return [r,g,b]
    }

    get vec4(){
        return [r,g,b,a]
    }
}

module.exports = RGBA