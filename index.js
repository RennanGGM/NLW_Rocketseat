const { select, input, checkbox } = require('@inquirer/prompts');
const { error } = require('console');
const fs = require("fs").promises

let message = "Bem-vindo(a) ao App de Metas";


let metas 

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch (error) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

 
const cadastrarMeta = async () => {
    const meta = await input({ message:"Digite a meta:" })

    if(meta.length == 0){
        console.log( 'A meta não pode ser vazia')
        return
        
    }

    metas.push({ value: meta, checked: false})
}

const listarMetas = async () => {

    if(metas.length == 0) {
        message = "Não existem metas!"
        return
    }

    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para selecionar ou para marcar/desmarcar e o Enter para finalizar essa etapa.",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        console.log ("Nenhum meta selecionada!")
        return
    }



    respostas.forEach((respostas) => {
        const meta = metas.find((m) => {
            return m.value == respostas
        }) 
        
        meta.checked = true
    })

    
    console.log('Meta(s) marcadas como concluída(s)')

}

const metasRealizadas = async () => {
    if(metas.length == 0) {
        message = "Não existem metas!"
        return
    }
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        console.log('Não existem metas realizadas')
        return 
        
    }

    await select({
        message: "Metas realizadas: "  + realizadas.length,
        choices: [...realizadas]
    
    })
} 

const metasAbertas = async () => {
    if(metas.length == 0) {
        message = "Não existem metas!"
        return
    }
    const abertas = metas.filter((meta) => {
        return meta.checked != true 
    })

    if(abertas.length == 0) {
        console.log("Não existem metas abertas")
        return
    }   

    await select({
        message: "Metas abertas: "  + abertas.length,
        choices: [...abertas]
    })
}     

const deletarMetas = async () => {
    if(metas.length == 0) {
        message = "Não existem metas!"
        return
    }   
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    
    })
    
    const itemsADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itemsADeletar.length == 0) {
        console.log ("Nenhum item para deletar")
        return
    }

    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })
    console.log("Meta(s) deleta(s) com sucesso!")
}

const mostrarMensagem = () => {
    console.clear();

    if(message != "") {
        console.log(message)
        console.log("")
        message = "" 
    }
}

const start = async () => {
    await carregarMetas()

    while(true){
        mostrarMensagem()
    await salvarMetas ()
        
        const opcao = await select ({
            message: "Menu >",
            choices: [
                {
                    name:"Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name:  "Listar metas",
                    value: "listar"
                },
                {
                    name:  "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name:  "Metas abertas",
                    value: "abertas"
                },
                {
                    name:  "Deletar metas",
                    value: "deletar"
                },
                {
                   name: "Sair",
                    value: "sair"
                }    
            ]

        })
                   
        
        switch(opcao){
            case "cadastrar":
                await cadastrarMeta()
                    console.log (metas)
                console.log("vamos cadastrar")
                break
            case "listar": 
                await listarMetas()
                break 
            case "realizadas":
                await metasRealizadas()
                break 
            case "abertas":
                await metasAbertas()
                break 
            case "deletar":
                await deletarMetas()
                break 

            case "sair":
                console.log("Até a próxima!")
                return
        }
    }
}

start ()