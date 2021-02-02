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
  const [wins, setWins] = useState<number>();
  const [loss, setLoss] = useState<number>();
  const [teamPoints, setTeamPoints] = useState<number>();
  const [enemyPoints, setEnemyPoints] = useState<number>();
  const [totalPoints, setTotalPoints] = useState<number>();
  const [numberOfGames, setNumberOfGames] = useState<number>();

  const handleDeleteWinnerLoser = async (winner:any, loser:any, game:any, winnerScore:number, enemyScore:number) =>{
    await db.collection('rankings').doc(winner).get().then((rankings:any) =>{
      setWins(rankings.doc().wins - 1)
      setNumberOfGames(rankings.doc().NumberOfGames - 1)
      setTeamPoints(rankings.doc().teamPoints - winnerScore);
      setEnemyPoints(rankings.doc().enemyPoints - enemyScore);
      setTotalPoints(teamPoints && enemyPoints? teamPoints - enemyPoints : 0);
    })
   await db.collection('ranking').doc(winner).update({
      wins,
      numberOfGames,
      teamPoints,
      enemyPoints,
      totalPoints,
    })
   await db.collection('rankings').doc(loser).get().then((rankings:any) =>{
      setLoss(rankings.doc().loss - 1)
      setNumberOfGames(rankings.doc().NumberOfGames - 1)
      setTeamPoints(rankings.doc().teamPoints - enemyScore);
      setEnemyPoints(rankings.doc().enemyPoints - winnerScore);
      setTotalPoints(teamPoints && enemyPoints? teamPoints - enemyPoints : 0)
    })
   await db.collection('ranking').doc(loser).update({
      loss,
      games,
      teamPoints,
      enemyPoints,
      totalPoints,
    })

  }

  const handleDelete = (game: any) => {
    db.collection("games")
      .doc(game.ID)
      .delete()
      .then(() => {
        setGames([])
        fetchGames();
      });

    if(game.homeScore > game.visitorScore){
      handleDeleteWinnerLoser(game.homeTeam, game.visitorTeam, game, game.homeScore, game.visitorScore);

    } else if(game.visitorScore > game.homeScore){
      handleDeleteWinnerLoser(game.visitorTeam, game.homeTeam, game, game.visitorScore, game.homeScore);
    }
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
      await db.collection('teams').doc(game.visitorTeam).get().then((team:any) =>{
        game.visitorTeamPhoto = team.data().logo
        game.visitorTeamName = team.data().name
      });
      await db.collection('teams').doc(game.homeTeam).get().then((team:any) =>{
        game.homeTeamPhoto = team.data().logo
        game.homeTeamName = team.data().name
        game.stadium = team.data().stadium;
      });
        
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
                <img src={game.homeTeamPhoto} alt={`${game.homeTeamName} logo`}/>
            </IonAvatar>
                <IonLabel>{game.homeScore} {game.homeTeamName} vs {game.visitorTeamName} {game.visitorScore}</IonLabel>
                <IonAvatar slot="end">
                <img src={game.visitorTeamPhoto} alt={`${game.visitorTeamName} logo`}/>
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