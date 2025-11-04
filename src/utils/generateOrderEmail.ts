// Email template utilities for order notifications

export function generateOrderEmailHTML(orderData: {
    orderNumber: string
    customerPhone: string
    fullAddress: string
    addressComment?: string
    totalAmount: number
    deliveryFee: number
    notes?: string
    itemsHtml: string
    adminOrderUrl: string
  }) {
    const {
      orderNumber,
      customerPhone,
      fullAddress,
      addressComment,
      totalAmount,
      deliveryFee,
      notes,
      itemsHtml,
      adminOrderUrl,
    } = orderData
  
    return `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Новый заказ ${orderNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f8fafc;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 32px 24px;
            text-align: center;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .order-number {
            font-size: 18px;
            font-weight: 500;
            opacity: 0.9;
          }
          
          .content {
            padding: 32px 24px;
          }
          
          .info-section {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            border-left: 4px solid #667eea;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .info-row:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
          }
          
          .info-label {
            font-weight: 600;
            color: #4a5568;
            min-width: 140px;
            font-size: 14px;
          }
          
          .info-value {
            color: #2d3748;
            font-weight: 500;
            flex: 1;
            text-align: right;
          }
          
          .price-highlight {
            font-size: 18px;
            font-weight: 700;
            color: #38a169;
          }
          
          .items-section {
            margin: 32px 0;
          }
          
          .section-title {
            font-size: 20px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid #667eea;
          }
          
          .items-list {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .items-list ul {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          
          .items-list li {
            padding: 16px 20px;
            border-bottom: 1px solid #f7fafc;
            font-size: 15px;
            color: #4a5568;
          }
          
          .items-list li:last-child {
            border-bottom: none;
          }
          
          .cta-section {
            text-align: center;
            margin: 32px 0;
          }
          
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
          }
          
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
          }
          
          .footer {
            background-color: #f8fafc;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          .timestamp {
            color: #718096;
            font-size: 13px;
            font-style: italic;
          }
          
          .comment-section {
            background-color: #fff5f5;
            border-left: 4px solid #fc8181;
            padding: 16px;
            margin: 16px 0;
            border-radius: 0 8px 8px 0;
          }
          
          .comment-section .info-label {
            color: #c53030;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              margin: 0;
              box-shadow: none;
            }
            
            .header {
              padding: 24px 16px;
            }
            
            .header h1 {
              font-size: 24px;
            }
            
            .content {
              padding: 24px 16px;
            }
            
            .info-section {
              padding: 16px;
            }
            
            .info-row {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .info-value {
              text-align: left;
              margin-top: 4px;
            }
            
            .cta-button {
              padding: 14px 24px;
              font-size: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🎉 Новый заказ!</h1>
            <div class="order-number">№ ${orderNumber}</div>
          </div>
          
          <div class="content">
            <div class="info-section">
              <div class="info-row">
                <span class="info-label">📞 Телефон:</span>
                <span class="info-value">${customerPhone}</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">📍 Адрес доставки:</span>
                <span class="info-value">${fullAddress}</span>
              </div>
              
              ${
                addressComment
                  ? `
              <div class="comment-section">
                <div class="info-row">
                  <span class="info-label">💬 Комментарий к адресу:</span>
                  <span class="info-value">${addressComment}</span>
                </div>
              </div>
              `
                  : ""
              }
              
              <div class="info-row">
                <span class="info-label">💰 Сумма заказа:</span>
                <span class="info-value price-highlight">${totalAmount}₽</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">🚚 Доставка:</span>
                <span class="info-value">${deliveryFee}₽</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">📊 Итого:</span>
                <span class="info-value price-highlight">${totalAmount + deliveryFee}₽</span>
              </div>
              
              ${
                notes
                  ? `
              <div class="comment-section">
                <div class="info-row">
                  <span class="info-label">📝 Примечания:</span>
                  <span class="info-value">${notes}</span>
                </div>
              </div>
              `
                  : ""
              }
            </div>
            
            <div class="items-section">
              <h2 class="section-title">🛍️ Товары в заказе</h2>
              <div class="items-list">
                <ul>${itemsHtml}</ul>
              </div>
            </div>
            
            <div class="cta-section">
              <a href="${adminOrderUrl}" target="_blank" rel="noopener noreferrer" class="cta-button">
                🔗 Открыть заказ в админке
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p class="timestamp">
              ⏰ Отправлено: ${new Date().toLocaleString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }
  
  // Usage example for the existing sendEmail function:
  export function getImprovedOrderEmailConfig(orderData: {
    orderNumber: string
    customerPhone: string
    fullAddress: string
    addressComment?: string
    totalAmount: number
    deliveryFee: number
    notes?: string
    itemsHtml: string
    adminOrderUrl: string
  }) {
    return {
      subject: `🎉 Новый заказ: ${orderData.orderNumber}`,
      html: generateOrderEmailHTML(orderData),
    }
  }
