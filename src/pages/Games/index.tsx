import React, { useState, useEffect } from 'react';
import { IonAvatar, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar} from '@ionic/react';
import fire from 'firebase';
import { RefresherEventDetail } from "@ionic/core";

import './styles.css';
import { addOutline } from 'ionicons/icons';
import SkeletonCustom from '../../components/SkeletonCustom';

const Games: React.FC = () => {
  const db = fire.firestore();

  const [games, setGames] = useState<any>();

  const handleDelete = (game: any) => {
    db.collection("games")
      .doc(game.ID)
      .delete()
      .then(() => {
        console.log("deleted");
      });
  };

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    fetchGames();
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

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
     setTimeout(() => setGames(gameData), 500);
  }

  useEffect(()=>{
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
      <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerDirection="forward" routerLink="/add-game">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
        {games ? 
        <IonList>
          {games.map( (game:any) =>{
            return(
              <IonItemSliding key={Math.random()}>
              <IonItemOptions side="end">
                <IonItemOption
                  color="danger"
                  onClick={(e) => handleDelete(game)}
                  expandable
                >
                  Delete
                </IonItemOption>
              </IonItemOptions>
            <IonItem lines="full" key={Math.random()}>
            <IonAvatar slot="start">
                <img src={game.homeTeamPhoto} alt={`${game.homeTeam} logo`}/>
            </IonAvatar>
                <IonLabel>{game.homeTeam} vs {game.visitorTeam}</IonLabel>
                <IonAvatar slot="end">
                <img src={game.visitorTeamPhoto} alt={`${game.visitorTeam} logo`}/>
            </IonAvatar>
            </IonItem>
            </IonItemSliding>
          )})}
        </IonList>
        : 
        <SkeletonCustom/>
            }
      </IonContent>
    </IonPage>
  );
};

export default Games;