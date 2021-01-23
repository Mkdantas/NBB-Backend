import React, { useState, useEffect } from 'react';
import { IonAvatar, IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar} from '@ionic/react';
import fire from 'firebase';
import { RefresherEventDetail } from "@ionic/core";

import './styles.css';
import { addOutline, arrowBack } from 'ionicons/icons';
import SkeletonCustom from '../../components/SkeletonCustom';
import UpdateData from '../../components/UpdateData';

const Games: React.FC = () => {
  const db = fire.firestore();

  const [games, setGames] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState('');

  const handleDelete = (game: any) => {
    db.collection("games")
      .doc(game.ID)
      .delete()
      .then(() => {
        setGames([])
        fetchGames();
      });
  };

  const handleEdit = (game: any) => {
    setEditItem(game.ID);
    setShowModal(true);
  };

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    fetchGames();
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

  const fetchGames = async () =>{
    const fetchedGames = await db.collection('games').get();
    let gameData = fetchedGames.docs.map((doc:any) =>{
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
        
          setGames(gameData)
      });
    
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
      <IonModal isOpen={showModal} cssClass='my-custom-class'>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={() => setShowModal(false)}>
            <IonIcon ios={arrowBack} md={arrowBack}/> 
          </IonButton>
          <IonTitle>Update Game</IonTitle>
        </IonToolbar>
      </IonHeader>
        <UpdateData updateID={editItem} type="game"/>
      </IonModal>
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
              <IonItemOptions side="start" onIonSwipe={e => console.log('foi')}>
                    <IonItemOption
                      onClick={(e) => handleEdit(game)}
                      expandable
                    >
                      Edit
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