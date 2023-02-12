<script lang="ts">

    import {newGame} from "$lib/firebase";
    import {goto} from "$app/navigation";

    let nplaying = 1
    let currentPlayer = ""
    let players = []
    let creatingGame = false

    async function createGame() {
        creatingGame = true
        const docRef = await newGame(players)
        creatingGame = false
        await goto(`/game/${docRef.id}`, {replaceState: true})
    }

    function addPlayer() {
        players = [...players, currentPlayer]
        currentPlayer = ""
        nplaying++
    }

    function removePlayer(playerName) {
        players = players.filter(p => p !== playerName)
        nplaying--
    }

</script>

<main class="container" id="main">
    <h1>Nouvelle partie</h1>
    <section>
        <h3>
            Ajouter un joueur
        </h3>
        <form on:submit|preventDefault={addPlayer}>
            <label for="playerInput">
                Nom du joueur
                <input bind:value={currentPlayer} id="playerInput" placeholder="{'Nom joueur #' + nplaying}"
                       type="text">
            </label>
            <button type="submit">
                Ajouter le joueur
            </button>
        </form>
    </section>

    {#if nplaying > 1}
        <hr/>
        <section>
            <h3>
                Joueurs
            </h3>
            <ul>
                {#each players as player}
                    <li>
                        <a on:click={removePlayer(player)}>{player}</a>
                    </li>
                {/each}
            </ul>
        </section>
    {/if}
    {#if nplaying > 2}
        <hr/>
        <section>
            <h2>
                Lancer la partie
            </h2>
            <button on:click={createGame} aria-busy={creatingGame}>
                Jouer
            </button>
        </section>
    {/if}
</main>