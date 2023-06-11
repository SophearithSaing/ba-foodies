$(() => {
  const output = $('.output');
  const outputContent = $('.output .content');

  let data = $('.tab-item.selected').data('type');
  $(`.${data}`).fadeIn({ duration: 200 });

  bindAdditionAddFoodEvent();
  bindExclusionAddFoodEvent();

  $('.tab-item').on('click', function () {
    $('.tab-item').removeClass('selected');
    const selectedTabWidth = $(this).outerWidth();
    const distance = $(this).position().left;
    $('.tabs .indicator').css('transform', `translateX(${distance}px)`);
    $(this).addClass('selected');

    $(`.form`).fadeOut({ duration: 200 });
    data = $(this).data('type');
    setTimeout(() => {
      $(`.${data}`).fadeIn({ duration: 200 });
    }, 200);
  });

  $('.equal .calc').on('click', function () {
    resetOutput();

    const price = Number($('.equal #price').val());
    const people = Number($('.equal #people').val());
    const amount = price / people;
    const html = `<p>Each person has to pay ${amount.toString()} baht</p>`;
    outputContent.append(html);
    output.slideDown();
  });

  $('.individual .add').on('click', function () {
    const rowCount = $('.individual .row.person').length;
    const personRowHtml = `
      <div class="row person">
        <input id="person-${
          rowCount + 1
        }-name" type="text" placeholder="Person ${rowCount + 1}" />
        <input id="person-${
          rowCount + 1
        }-amount" type="number" placeholder="Amount" />
      </div>
    `;
    $(personRowHtml).insertAfter($('.individual .row.person')[rowCount - 1]);
  });

  $('.individual .calc').on('click', function () {
    resetOutput();

    const vat = Number($('#individual-vat').val());
    const service = Number($('#individual-service').val());
    let total = 0;

    $('.individual .row.person').each(function (index) {
      const number = index + 1;
      const name = $(`#person-${number}-name`).val();
      const amount = Number($(`#person-${number}-amount`).val());
      const amountWithVat = (amount * vat) / 100;
      const amountWithService = (amount * service) / 100;
      const totalAmount = amount + amountWithVat + amountWithService;
      const personHtml = `
        <p class="person">
          <span class="name">${name}</span>
          <span class="number">${amount}</span>
          <span>+</span>
          <span class="number">${amountWithVat}</span>
          <span>+</span>
          <span class="number">${amountWithService}</span>
          <span>=</span>
          <span class="number">${totalAmount}</span>
        </p>
      `;

      outputContent.append(personHtml);
      total += totalAmount;

      if (index === $('.individual .row.person').length - 1) {
        const totalHtml = `
          <p class="total">
            <span class="name">Total</span>
            <span class="number">${total}</span>
          </p>
        `;
        outputContent.append(totalHtml);
      }
    });

    output.slideDown();
  });

  $('.other .shared .add').on('click', function () {
    const rowCount = $('.other .shared-items .row.food').length;
    const rowHtml = `
      <div class="row food">
        <input id="food-price-${
          rowCount + 1
        }" type="text" placeholder="Food Price ${rowCount + 1}" />
      </div>
    `;
    $(rowHtml).insertAfter($('.other .shared-items .row.food')[rowCount - 1]);
  });

  $('.other .exclusion .add-exclusion-item').on('click', function () {
    const rowCount = $('.other .exclusion-item').length;
    const nextNumber = rowCount + 1;
    const rowHtml = `
      <div class="exclusion-item item-${nextNumber}">
        <div class="row">
          <input id="exclusion-${nextNumber}-name" type="text" placeholder="Name ${nextNumber}" />
          <button class="add-food" data-number="${nextNumber}"><i class="bi bi-plus"></i></button>
        </div>
        <div class="row food">
          <input
            id="exclusion-${nextNumber}-price-1"
            type="text"
            placeholder="Food Price 1"
          />
          <button class="remove-food"><i class="bi bi-dash"></i></button>
        </div>
      </div>
    `;
    $(rowHtml).insertAfter($('.other .exclusion-item')[rowCount - 1]);

    unbindExclusionAddFoodEvent();
    bindExclusionAddFoodEvent();
  });

  $('.other .addition .add-addition-item').on('click', function () {
    const rowCount = $('.other .addition-item').length;
    const nextNumber = rowCount + 1;
    const rowHtml = `
      <div class="addition-item item-${nextNumber}">
        <div class="row">
          <input id="addition-${nextNumber}-name" type="text" placeholder="Name ${nextNumber}" />
          <button class="add-food" data-number="${nextNumber}"><i class="bi bi-plus"></i></button>
        </div>
        <div class="row food">
          <input
            id="addition-${nextNumber}-price-1"
            type="text"
            placeholder="Food Price 1"
          />
          <button class="remove-food"><i class="bi bi-dash"></i></button>
        </div>
      </div>
    `;
    $(rowHtml).insertAfter($('.other .addition-item')[rowCount - 1]);

    unbindAdditionAddFoodEvent();
    bindAdditionAddFoodEvent();
  });

  function resetOutput() {
    outputContent.empty();
    output.hide();
  }

  function bindExclusionAddFoodEvent() {
    $('.other .exclusion-item .add-food').on('click', function () {
      console.log('adding');
      const itemNumber = $(this).data('number');
      const rowCount = $(
        `.other .exclusion-item.item-${itemNumber} .row.food`
      ).length;
      const nextNumber = rowCount + 1;
      const rowHtml = `
        <div class="row food">
          <input
            id="exclusion-${itemNumber}-price-${nextNumber}"
            type="text"
            placeholder="Food Price ${nextNumber}"
          />
        </div>
      `;
      $(rowHtml).insertAfter(
        $(`.other .exclusion-item.item-${itemNumber} .row.food`)[rowCount - 1]
      );
    });
  }

  function unbindExclusionAddFoodEvent() {
    $('.other .exclusion-item .add-food').off();
  }

  function bindAdditionAddFoodEvent() {
    $('.other .addition-item .add-food').on('click', function () {
      console.log('adding');
      const itemNumber = $(this).data('number');
      const rowCount = $(
        `.other .addition-item.item-${itemNumber} .row.food`
      ).length;
      const nextNumber = rowCount + 1;
      const rowHtml = `
        <div class="row food">
          <input
            id="addition-${itemNumber}-price-${nextNumber}"
            type="text"
            placeholder="Food Price ${nextNumber}"
          />
        </div>
      `;
      $(rowHtml).insertAfter(
        $(`.other .addition-item.item-${itemNumber} .row.food`)[rowCount - 1]
      );
    });
  }

  function unbindAdditionAddFoodEvent() {
    $('.other .addition-item .add-food').off();
  }
});
