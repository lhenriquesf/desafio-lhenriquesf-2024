class RecintosZoo {

    constructor() {
        this.animais = [
            { especie: 'LEAO', tamanho: 3, biomas: ['savana'] },
            { especie: 'LEOPARDO', tamanho: 2, biomas: ['savana'] },
            { especie: 'CROCODILO', tamanho: 3, biomas: ['rio'] },
            { especie: 'MACACO', tamanho: 1, biomas: ['savana', 'floresta'] },
            { especie: 'GAZELA', tamanho: 2, biomas: ['savana'] },
            { especie: 'HIPOPOTAMO', tamanho: 4, biomas: ['savana', 'rio'] }
        ];

        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: ['MACACO', 'MACACO', 'MACACO'] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: ['GAZELA'] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: ['LEAO'] }
        ];
    }

    analisaRecintos(animal, quantidade) {
        const validacao = this.validarAnimalEQuantidade(animal, quantidade);

        if (validacao.erro) {
            return validacao;
        }
        const { especie } = validacao;

        const recintosViaveis = this.validarRecintosAdequados(especie, quantidade);

        return this.mostrarRecintosEncontrados(recintosViaveis, especie, quantidade);
    }


    validarAnimalEQuantidade(animal, quantidade) {
        const especie = this.animais.find(a => a.especie == animal.toUpperCase());

        if (!especie) {
            return { erro: "Animal inválido" };
        }
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }
        return { especie };
    }


    calcularEspacoOcupado(recinto, especie) {
        let espacoOcupado = 0;
        let contemEspecieDiferente = false;

        for (const especieAtual of recinto.animais) {
            const animalExistente = this.animais.find(e => e.especie == especieAtual);
            if (animalExistente) {
                espacoOcupado += animalExistente.tamanho;

                // Marca que há uma espécie diferente no recinto
                if (animalExistente.especie !== especie.especie) {
                    contemEspecieDiferente = true;
                }
            }
        }
        return {espacoOcupado, contemEspecieDiferente};
    }


    validarRecintosAdequados(especie, quantidade) {
        const carnivoros = ['LEAO', 'LEOPARDO', 'CROCODILO'];

        return this.recintos.filter(recinto => {

            // Valida se o bioma é adequadO
            if (!especie.biomas.includes(recinto.bioma) && !(especie.biomas.length > 1 && recinto.bioma == 'savana e rio')) {
                return false;
            }

            // Validação da Regra: Carnívoros só podem habitar com a mesma espécie
            if (carnivoros.includes(especie.especie)) {
                if (recinto.animais.length > 0 && recinto.animais.filter(a => a != especie.especie).length > 0) {
                    return false;
                }
            } else {
                const animaisCarnivoros = recinto.animais.filter(a => carnivoros.includes(a));
                if (animaisCarnivoros.length > 0) {
                    return false;
                }
            }

            //Validação da Regra: Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio
            if (especie.especie == 'HIPOPOTAMO' && recinto.bioma != 'savana e rio') {
                return false;
            }
            
            // Validação da Regra: Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
            if (especie.especie == 'MACACO' && quantidade < 2 && recinto.animais.length == 0) {
                return false;
            }

            //Validação da Regra: Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado
            const {espacoOcupado, contemEspecieDiferente} = this.calcularEspacoOcupado(recinto, especie);

            const espacoNecessario = (especie.tamanho * quantidade) + (contemEspecieDiferente ? 1 : 0);

            if ((espacoNecessario + espacoOcupado) > recinto.tamanho) {
                return false;
            }

            return true;
        });
    }


    mostrarRecintosEncontrados(recintosViaveis, especie, quantidade) {
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return {
             // Função map: percorre os recintos viáveis e gera uma lista de recintos com espaço livre
            recintosViaveis: recintosViaveis.map(recinto => {

                const {espacoOcupado, contemEspecieDiferente} = this.calcularEspacoOcupado(recinto, especie);
                const espacoNecessario = (especie.tamanho * quantidade) + (contemEspecieDiferente ? 1 : 0);

                const espacoLivre = recinto.tamanho - (espacoOcupado + espacoNecessario);

                return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
            })
        };
    }

}

export { RecintosZoo as RecintosZoo };
