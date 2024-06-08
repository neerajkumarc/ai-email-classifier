export const getEmails = async (token, count) => {
    let emailData = []
    try {
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching emails: ${response.statusText}`);
      }
  
      const data = await response.json();
      const messages = data.messages.slice(0, count) || [];
      for(const msg of messages){
        const msgDetails = await fetchMessageDetails(token, msg.id)
        emailData.push({msgDetails})
      }
      console.log('Email messages:', messages);
      return emailData
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };
  
  async function fetchMessageDetails(token, messageId) {
    try {
      const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching message details: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching message details:', error);
      return null;
    }
  }