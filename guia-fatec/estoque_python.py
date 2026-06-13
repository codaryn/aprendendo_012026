import pandas as pd
import os

if not os.path.exists("estoque.csv"):
    df = pd.DataFrame(
        columns=["id", "produto", "quantidade", "preco_unitario"])
    df.to_csv("estoque.csv", index=False)

df_resultado = pd.read_csv("estoque.csv")

res = ""
while res != "n":
    print("\n", "="*10, "Bem vindo ao sistema de estoque para microempresas", "="*10, "\n")

    try:
        escolha = int(input(
            "  [1] Adicionar produto \n  [2] Pesquisar produto \n  [3] Mostrar o estoque inteiro \n  [4] Excluir produto \n  [5] Ordenar estoque \n  [6] Esvaziar estoque \n  [7] Atualizar preço \n  [8] Sair \n\n ... "))

    except ValueError:
        print("\nDigite uma opção válida\n")
        continue

    if escolha == 1:
        if not df_resultado.empty:
            id_prod = int(df_resultado["id"].max()) + 1
        else:
            id_prod = 1

        produto = ""
        while not produto:
            produto = input("\nDigite o nome do produto: \n").strip().replace(
                " ", "_").lower()
            if not produto:
                print("O nome do produto não pode ser vazio!")

        produto_ja_existe = produto in df_resultado["produto"].values

        qnt = 0
        while qnt <= 0:
            try:
                qnt = int(input("\nDigite a quantidade: \n"))
                if qnt <= 0:
                    print("A quantidade tem que ser maior que 0")
            except ValueError:
                print("\nDigite apenas números\n")

        if produto_ja_existe:
            df_resultado.loc[df_resultado["produto"]
                             == produto, "quantidade"] += qnt
            print(
                f"\nEstoque de '{produto}' atualizado com sucesso (Quantidade somada)!\n")

            df_resultado.to_csv("estoque.csv", index=False)

            print("\n", 34*"=")
            print(df_resultado)
            print(34*"=", "\n")
            continue

        preco = 0
        while preco <= 0:
            try:
                preco = float(input("\nDigite o preço: \n"))
                if preco <= 0:
                    print("O preço tem que ser maior que 0")
            except ValueError:
                print("\nDigite apenas números\n")

        nova_linha = pd.DataFrame([{
            "id": id_prod,
            "produto": produto,
            "quantidade": qnt,
            "preco_unitario": preco}])
        nova_linha.to_csv("estoque.csv", mode="a", header=False, index=False)
        df_resultado = pd.read_csv("estoque.csv")

        print("\n", 41*"=")
        print(df_resultado)
        print(41*"=", "\n")

    elif escolha == 2:
        produto = ""
        while not produto:
            produto = input("\nDigite o nome do produto: \n").strip().replace(
                " ", "_").lower()

        df_produto = df_resultado[df_resultado["produto"] == produto]

        if df_produto.empty:
            print("\nNão está no estoque")
        else:
            print("\n", 41*"=")
            print(df_produto)
            print(41*"=", "\n")

    elif escolha == 3:
        print("\n", 41*"=")
        if df_resultado.empty:
            print("O estoque está vazio")
        else:
            print(df_resultado)
        print(41*"=", "\n")

    elif escolha == 4:
        if df_resultado.empty:
            print("\n", 41*"=")
            print("\nO estoque está vazio\n")
            print(41*"=", "\n")
        else:
            print("\n", 41*"=")
            print(df_resultado)
            print(41*"=", "\n")

            produto = ""
            while not produto:
                produto = input("Digite o nome do produto para deletar: ").strip().replace(
                    " ", "_").lower()

            if produto not in df_resultado["produto"].values:
                print("\nProduto não encontrado no estoque.")
                continue

            try:
                ex = int(input(
                    "\n[1] Deletar todo o estoque de um produto\n[2] Deletar fragmentos \n\n ... "))
            except ValueError:
                print("\nDigite uma opção válida\n")
                continue

            if ex == 1:
                df_filtrado = df_resultado[df_resultado["produto"] != produto]

                if len(df_filtrado) == len(df_resultado):
                    print("Produto não encontrado")
                else:
                    df_filtrado.to_csv("estoque.csv", index=False)
                    df_resultado = df_filtrado
                    print("\nProduto deletado com sucesso!")

            elif ex == 2:
                qnt_atual = df_resultado.loc[df_resultado["produto"]
                                             == produto, "quantidade"].values[0]

                while True:
                    try:
                        qnt_ex = int(input("\nDeseja excluir quantos?\n"))
                        if qnt_ex <= 0:
                            print("A quantidade a excluir deve ser maior que 0.")
                            continue

                        if qnt_ex > qnt_atual:
                            print(
                                f"Você só tem {qnt_atual} unidades desse produto. Tente novamente.")
                            continue

                        break
                    except ValueError:
                        print("Digite um número válido")

                df_resultado.loc[df_resultado["produto"]
                                 == produto, "quantidade"] -= qnt_ex
                df_resultado = df_resultado[df_resultado["quantidade"] > 0]

                df_resultado.to_csv("estoque.csv", index=False)

            print("\n", 41*"=")
            print(df_resultado)
            print(41*"=", "\n")

    elif escolha == 5:
        while True:
            try:
                ordenacao = int(input(
                    "\n  [1] Ordenar por ID \n  [2] Ordenar por produto \n  [3] Ordenar por quantidade \n  [4] Ordenar por preço \n\n ... "))
                break
            except ValueError:
                print("Digite opções válidas")

        if ordenacao == 1:
            df_resultado = df_resultado.sort_values(by="id")
            print("\n", 41*"=")
            print(df_resultado)
            print(41*"=", "\n")
            df_resultado.to_csv("estoque.csv", index=False)

        elif ordenacao == 2:
            df_resultado = df_resultado.sort_values(by="produto")
            print("\n", 41*"=")
            print(df_resultado)
            print(41*"=", "\n")
            df_resultado.to_csv("estoque.csv", index=False)

        elif ordenacao == 3:
            df_resultado = df_resultado.sort_values(
                by="quantidade", ascending=False)
            print("\n", 41*"=")
            print(df_resultado)
            print(41*"=", "\n")
            df_resultado.to_csv("estoque.csv", index=False)

        elif ordenacao == 4:
            df_resultado = df_resultado.sort_values(
                by="preco_unitario", ascending=False)
            print("\n", 41*"=")
            print(df_resultado)
            print(41*"=", "\n")
            df_resultado.to_csv("estoque.csv", index=False)
        else:
            print("\nDigite números válidos\n")

    elif escolha == 6:
        df_resultado = pd.DataFrame(
            columns=["id", "produto", "quantidade", "preco_unitario"])
        df_resultado.to_csv("estoque.csv", index=False)
        print("\n", 41*"=")
        print("\nO estoque está vazio\n")
        print(41*"=", "\n")

    elif escolha == 7:
        if df_resultado.empty:
            print("\n", 41*"=")
            print("\nO estoque está vazio\n")
            print(41*"=", "\n")
        else:
            print("\n", 41*"=")
            print(df_resultado)
            print(41*"=", "\n")

            produto = ""
            while not produto:
                produto = input("Digite o nome do produto para atualizar o preço: ").strip(
                ).replace(" ", "_").lower()

            if produto not in df_resultado["produto"].values:
                print("\nProduto não encontrado")
                continue

            novo_preco = 0
            while novo_preco <= 0:
                try:
                    novo_preco = float(input("\nDigite o novo preço: \n"))
                    if novo_preco <= 0:
                        print("O preço tem que ser maior que 0")
                except ValueError:
                    print("\nDigite apenas números\n")

            df_resultado.loc[df_resultado["produto"] ==
                             produto, "preco_unitario"] = novo_preco
            df_resultado.to_csv("estoque.csv", index=False)

            print(f"\nPreço do produto '{produto}' atualizado com sucesso!\n")

            print("\n", 41*"=")
            print(df_resultado)
            print(41*"=", "\n")

    elif escolha == 8:
        break

    else:
        print("\nDigite uma opção válida\n")

    while True:
        res = input("\nDeseja fazer algo a mais? s|n \n").strip().lower()

        if res not in ["n", "s"]:
            print("\nResponda com s ou n \n")
        else:
            break

print("\n", 41*"=")
print("Obrigado por utilizar nosso sistema!")
print(41*"=", "\n")
