import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { DrawerComponent } from '../../components/Drawer'
import { useStyles } from './style';
import CssBaseline from '@material-ui/core/CssBaseline';

const App = () => {
  //state
  const [mobileOpen, setMobileOpen] = useState(false);
  //variable
  const classes = useStyles();
  //function
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    getPokemon();
  }, [])

  //render
  return (
    <div className={classes.root}>
      <CssBaseline />
      <header>
        <Header handleDrawerToggle={handleDrawerToggle} />
      </header>
        <DrawerComponent
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
      <main className={classes.content}>
        <div className={classes.toolbar} />
      </main>
      <footer>
        c
      </footer>
    </div>
  );
}

export default App;