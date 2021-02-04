import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { basketball, calendar, newspaper, podium } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Teams from './pages/Teams';
import Games from './pages/Games';
import fire from './fire';
import AddTeams from './pages/AddTeams';
import AddGames from './pages/AddGames';
import Ranking from './pages/Ranking';

const App: React.FC = () =>{
  fire
  .auth()
  .signInWithEmailAndPassword('matheus.kohaku.dantas@gmail.com', 'Lalic1206');
  return (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/teams" component={Teams} exact={true} />
          <Route path="/add-team" component={AddTeams} exact />
          <Route path="/games" component={Games} />
          <Route path="/add-game" component={AddGames} exact />
          <Route path="/ranking" component={Ranking} exact />
          <Route path="/" render={() => <Redirect to="/teams" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/posts">
            <IonIcon icon={newspaper} />
            <IonLabel>Posts</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/teams">
            <IonIcon icon={basketball} />
            <IonLabel>Teams</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/games">
            <IonIcon icon={calendar} />
            <IonLabel>Games</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab4" href="/ranking">
            <IonIcon icon={podium} />
            <IonLabel>Rankings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
)};

export default App;
