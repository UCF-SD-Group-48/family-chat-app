

//Helper functions

const helpers = {

    getGroupCoverImage: function(color, number){
        // let letter;
    
        // if (color === 'purple')letter = 'P';
        // else if (color === 'blue') letter = 'B';
        // else if  (color === 'green') letter = 'G';
        // else if  (color === 'yellow') letter = 'Y';
        // else if  (color === 'orange') letter = 'O';
        // else if  (color === 'red') letter = 'R';
    
        // const pathValue = `${letter}` + `${number}`
        // console.log(pathValue, 'is a', typeof(pathValue))
    
        // return require('../assets/groupCoverImages/cover_' + pathValue + '.png')
    
        // return require(`../assets/groupCoverImages/cover_${letter}${number}.png`)
    
        if (color === 'purple') {
          switch (number) {
            case 1: {
              return require('../assets/groupCoverImages/cover_P1.png')
            }
            case 2: {
              return require('../assets/groupCoverImages/cover_P2.png')
            }
            case 3: {
              return require('../assets/groupCoverImages/cover_P3.png')
            }
            case 4: {
              return require('../assets/groupCoverImages/cover_P4.png')
            }
          }
        } else if (color === 'blue') {
          switch (number) {
            case 1: {
              return require('../assets/groupCoverImages/cover_B1.png')
            }
            case 2: {
              return require('../assets/groupCoverImages/cover_B2.png')
            }
            case 3: {
              return require('../assets/groupCoverImages/cover_B3.png')
            }
            case 4: {
              return require('../assets/groupCoverImages/cover_B4.png')
            }
          }
        } else if (color === 'green') {
          switch (number) {
            case 1: {
              return require('../assets/groupCoverImages/cover_G1.png')
            }
            case 2: {
              return require('../assets/groupCoverImages/cover_G2.png')
            }
            case 3: {
              return require('../assets/groupCoverImages/cover_G3.png')
            }
            case 4: {
              return require('../assets/groupCoverImages/cover_G4.png')
            }
          }
        } else if (color === 'yellow') {
          switch (number) {
            case 1: {
              return require('../assets/groupCoverImages/cover_Y1.png')
            }
            case 2: {
              return require('../assets/groupCoverImages/cover_Y2.png')
            }
            case 3: {
              return require('../assets/groupCoverImages/cover_Y3.png')
            }
            default: {
              return;
            }
          }
        } else if (color === 'orange') {
          switch (number) {
            case 1: {
              return require('../assets/groupCoverImages/cover_O1.png')
            }
            case 2: {
              return require('../assets/groupCoverImages/cover_O2.png')
            }
            case 3: {
              return require('../assets/groupCoverImages/cover_O3.png')
            }
            default: {
              return;
            }
          }
        } else if (color === 'red') {
          switch (number) {
            case 1: {
              return require('../assets/groupCoverImages/cover_R1.png')
            }
            case 2: {
              return require('../assets/groupCoverImages/cover_R2.png')
            }
            case 3: {
              return require('../assets/groupCoverImages/cover_R3.png')
            }
            default: {
              return;
            }
          }
        }
    }
}

export default helpers;