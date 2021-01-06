import React, { useState, useEffect } from 'react';
import { IonAvatar, IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import fire from 'firebase';

import './styles.css';
import { addOutline } from 'ionicons/icons';

const Games: React.FC = () => {
  const db = fire.firestore();

  const [games, setGames] = useState([{}]);
  const [visitorTeam, setVisitorTeam] = useState([{}]);
  const [homeTeam, setHomeTeam] = useState([{}]);

  useEffect(()=>{
  const fetchGames = async () =>{
  const fetchedGames = await db.collection('games').get();
  const gameData = fetchedGames.docs.map((doc:any) =>{
    return doc.data();
  })
   gameData.forEach(async (game:any) =>{
    var fetchVisitor = await db.collection('teams').where('name', '==', game.visitorTeam).get();
    var fetchHome = await db.collection('teams').where('name', '==', game.homeTeam).get();
      fetchVisitor.docs.map((doc:any) =>{
      game.visitorTeamPhoto = doc.data().logo
      })
      fetchHome.docs.map((doc:any) =>{
        game.homeTeamPhoto = doc.data().logo
        })
      
    });
   setGames(gameData);
}
fetchGames();
//eslint-disable-next-line
  }, [] );
  console.log(games);
  return (
    <IonPage className="games-page">
      <IonHeader>
        <IonToolbar>
          <IonMenuButton slot="start"/>
          <IonTitle>Games</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerDirection="forward" routerLink="/add-game">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
        <IonList>
          {games.map( (game:any) =>{
            return(
            <IonItem lines="full" key={Math.random()}>
            <IonAvatar slot="start">
                <img src={game.homeTeamPhoto} alt={`${game.homeTeam} logo`}/>
            </IonAvatar>
                <IonLabel>{game.homeTeam} vs {game.visitorTeam}</IonLabel>
                <IonAvatar slot="end">
                <img src={game.visitorTeamPhoto} alt={`${game.visitorTeam} logo`}/>
            </IonAvatar>
            </IonItem>
          )})}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Games;