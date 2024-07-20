/// <reference types="cypress" />
    
describe('Teste da Funcionalidade Produtos', () => {
    let token
    before(() =>{
        cy.token('fulano@qa.com', 'teste').then(tkn => {token = tkn})
    })

    it('Deve listar os produtos cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then((response) => {
            expect(response.body.produtos[9].nome).to.equal('Fantastic Metal Salad')
            expect(response.status).to.equal(200)            
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(400) 
        })
    })

    it('Cadastrar um novo produto', () => {
        let produto = `Logitech ${Math.floor(Math.random() * 10000)}` //Função para gerar um numero aleatorio
        cy.request({
            method: 'POST',
            url: 'produtos',
            headers : {authorization: token},
            body: {
                "nome": produto,
                "preco": 500,
                "descricao": "Mouse",
                "quantidade": 381
              }              

        }).then((response) => {
            expect(response.status).to.equal(201)            
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            
        })        
    })

    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
        cy.cadastrarProduto(token, "Logitech 3242", 250, "Mouse", 400)
        
        .then((response) => {
            expect(response.status).to.equal(400)            
            expect(response.body.message).to.equal('Já existe produto com esse nome')
            
        })        
    })

    it('Deve editar um produto já cadastrado', () => {
        cy.request('produtos').then(response =>{            
            let id = response.body.produtos[2]._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers : {authorization: token},
                body: {
                    "nome": "Logitech 3242",
                    "preco": 500,
                    "descricao": "Mouse Gamer",
                    "quantidade": 381
                  }              
    
            }).then((response) => {                        
                expect(response.body.message).to.equal('Registro alterado com sucesso')

            })    
        })        
    })
    it('Deve editar um produto cadastrado previamente', () => {
        let produto = `Logitech ${Math.floor(Math.random() * 10000)}` //Função para gerar um numero aleatorio
        cy.cadastrarProduto(token, produto, 250, "Mouse", 400)
        .then((response) => {
           let id = response.body._id

           cy.request({
            method: 'PUT',
            url: `produtos/${id}`,
            headers : {authorization: token},
            body: {
                "nome": produto,
                "preco": 500,
                "descricao": "Mouse Gamer",
                "quantidade": 50
              }
            }).then((response) => {                      
            expect(response.body.message).to.equal('Registro alterado com sucesso')

            })
        }) 
    })  
    
    it('Deve deletar um produto previamente cadastrado', () => {
        let produto = `Logitech ${Math.floor(Math.random() * 10000)}` //Função para gerar um numero aleatorio
        cy.cadastrarProduto(token, produto, 250, "Mouse", 400)
        .then((response) => {
            let id = response.body._id

            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers : {authorization: token},                
                }).then((response) => {                          
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)  
    
            })
        })    
        
    })
    

  })   