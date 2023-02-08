
export class Categoria {
    public id : string;
    public categoria: string;

    constructor(obj?: Partial<Categoria>) {
        if (obj) {
            this.id = obj.id
            this.categoria = obj.categoria
        }
    }

    toString() {
        const Objeto = `{
            "id": "${this.id}",
            "categoria": "${this.categoria}",
        }`

        //const fields = Object.values(this).join(', ')
        // const campos = Object.keys(this).join(': ')
        // const valor=Object.values(this).join(', ')
        // return `Usuario {${campos+valor}}`
        
        //let userStr = '{"name":"Sammy","email":"sammy@example.com","plan":"Pro"}';
        // let userObj = JSON.parse(Objeto);
        // console.log(userObj);

        return Objeto
    }

};