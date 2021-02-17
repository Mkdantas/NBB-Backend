import React, { useState, useEffect } from 'react';
import { IonAvatar, IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonTitle, IonToolbar} from '@ionic/react';
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
  const [skeleton, setSkeleton] = useState(true);
  const [filterDate, setfilterDate] = useState<any>('>=');

  const handleDeleteWinnerLoser = async (winner:any, loser:any, game:any, winnerScore:number, enemyScore:number) =>{
    await db.collection('ranking').doc(winner).get().then((rankings:any) =>{
      db.collection('ranking').doc(winner).update({
        wins: rankings.data().wins - 1,
        games: rankings.data().games - 1 ,
        teamPoints: rankings.data().teamPoints - winnerScore,
        enemyPoints: rankings.data().enemyPoints - enemyScore,
        totalPoints: (rankings.data().teamPoints - winnerScore) + (rankings.data().enemyPoints - enemyScore),
      })
    })  
    await db.collection('ranking').doc(loser).get().then((rankings:any) =>{
      db.collection('ranking').doc(loser).update({
        loss: rankings.data().loss - 1,
        games: rankings.data().games - 1,
        teamPoints: rankings.data().teamPoints - enemyScore,
        enemyPoints: rankings.data().enemyPoints - winnerScore,
        totalPoints: (rankings.data().teamPoints - enemyScore) + (rankings.data().enemyPoints - winnerScore),
      })
    })
  
  }

  const handleDelete = (game: any) => {
    db.collection("games")
      .doc(game.ID)
      .delete()
      .then(() => {
        setGames([])
        fetchGames(filterDate);
      });

    if(game.homeScore > game.visitorScore){
      handleDeleteWinnerLoser(game.homeTeam, game.visitorTeam, game, Number(game.homeScore), Number(game.visitorScore));

    } else if(game.visitorScore > game.homeScore){
      handleDeleteWinnerLoser(game.visitorTeam, game.homeTeam, game, Number(game.visitorScore), Number(game.homeScore));
    }
  };

  const handleEdit = (game: any) => {
    setEditItem(game.ID);
    setShowModal(true);
  };

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    fetchGames(filterDate);
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

  const fetchGames = async (dateFilter:any = '>=') =>{
    const fetchedGames = await db.collection('games').orderBy('selectedDate', 'asc').where('selectedDate', dateFilter, new Date().toISOString()).get();
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
        
          
      });
      setTimeout(() =>{
        setSkeleton(false);
         setGames(gameData)}
         , 500)
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
      <IonSegment value={filterDate} onIonChange={e =>{
        setGames([])
        setSkeleton(true)
        setfilterDate(e.detail.value);
        fetchGames(e.detail.value)
      } }>
          <IonSegmentButton mode="md" value="<=">
            <IonLabel>Past Games</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton  mode="md" value=">=">
            <IonLabel>Future Games</IonLabel>
          </IonSegmentButton>
        </IonSegment>
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
        <IonList>
          {games?.map( (game:any) =>{
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
                <IonLabel>{game.homeScore} vs {game.visitorScore}</IonLabel>
                <IonAvatar slot="end">
                <img src={game.visitorTeamPhoto} alt={`${game.visitorTeamName} logo`}/>
            </IonAvatar>
            </IonItem>
            </IonItemSliding>
          )})}
        </IonList>
        {skeleton ?  
        <SkeletonCustom/> : null
            }
      </IonContent>
    </IonPage>
  );
};

export default Games;