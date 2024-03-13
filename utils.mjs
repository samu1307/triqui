export const $ = (select) => document.querySelector(select);

export const $$ = (select) => document.querySelectorAll(select);

export const log = (con) => console.log(con);

export const setItemLocalStorage = (name, val) => localStorage.setItem(name, JSON.stringify(val));

export const getItemLocalStorage = (name) => { return JSON.parse(localStorage.getItem(name)); }
