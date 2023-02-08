
export class Usuario {
    public id : string;
    public email : string;
    public urlfoto : string;
    public nome: string;
    public telefone: string;
    public descricao : string;
    public listasimples: []

    constructor(obj?: Partial<Usuario>) {
        if (obj) {
            this.id = obj.id
            this.email = obj.email
            this.urlfoto = obj.urlfoto
            this.nome = obj.nome
            this.telefone= obj.telefone
            this.descricao = obj.descricao
            this.listasimples = obj.descricao
        }
    }

    toString() {
        const Objeto = `{
            "id": "${this.id}",
            "nome": "${this.nome}",
            "email": "${this.email}",
            "urlfoto": "${this.urlfoto}"
            "telefone": "${this.telefone}"
            "descricao": "${this.descricao}"
        }`

       
        return Objeto
    }

};