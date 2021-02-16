import { Grid } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Loading } from '../../components/Loading';
import { CustomPagination } from '../../components/Pagination';
import { PokeCard } from '../../components/PokeCard';
import { LIMIT } from '../../constants/poke';
import PokeApi from '../../services/PokeApi';

export const PokeLib = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [page, setPage] = useState({
        current: 1,
        previous: null,
        next: null
    })
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const mounted = useRef(true);

    const fetchPokemon = async (pageIndex, dexTotal) => {
        try {
            setLoading(true);
            let limit = LIMIT;
            if (LIMIT * (pageIndex + 1) > dexTotal) {
                limit = dexTotal - (pageIndex) * LIMIT;
            }
            const response = await Axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${LIMIT * pageIndex}&limit=${limit}`)
            if (response.status === 200) {
                if (mounted.current) {
                    setTotal(dexTotal || response.data.count);
                    setPage({ ...page, next: response.data.next, previous: response.data.previous, current: pageIndex + 1 })
                }
                const pokePromises = response.data.results.map(async function (pokeItem) {
                    return await PokeApi.getPokemonByName(pokeItem.name);
                })
                const listPokeResponse = await Promise.all(pokePromises);
                const pokemons = listPokeResponse.map(response => {
                    if (response.status === 200) {
                        let pokeData = response.data;
                        let types = pokeData.types.map(item => {
                            return item.type.name
                        })
                        return { name: pokeData.name, image: pokeData.sprites.other['official-artwork']['front_default'], height: pokeData.height, weight: pokeData.weight, order: pokeData.id, types: types }
                    }
                });
                if (mounted.current) {
                    setPokemonList(pokemons)
                }
            }
        } catch (ex) {
            console.log(ex)
        } finally {
            if (mounted.current) {
                setLoading(false);
            }
        }
    }

    const changePage = (e, value) => {
        const nationDexTotal = parseInt(sessionStorage.getItem("total"));
        sessionStorage.setItem('page', value - 1)
        fetchPokemon(value - 1, nationDexTotal)
    }


    useEffect(() => {
        let pageIndex = parseInt(sessionStorage.getItem('page')) || 0;
        const nationDexTotal = parseInt(sessionStorage.getItem("total"));
        mounted.current = true;
        fetchPokemon(pageIndex, nationDexTotal);
        return () => {
            mounted.current = false;
        }
    }, []);

    if (loading) {
        return <div>
            <Loading />
        </div>
    }

    return <div>
        <CustomPagination total={total} page={page.current} changePage={changePage} />
        <Grid container>
            {pokemonList.map(pokemon => {
                return <Grid item key={pokemon.order} xs={12} sm={4}>
                    <PokeCard pokemon={pokemon} />
                </Grid>
            })}
        </Grid>
    </div>
}