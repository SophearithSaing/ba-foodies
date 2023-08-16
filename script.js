$(() => {
  const output = $('.output');
  const outputContent = $('.output .content');

  let data = $('.tab-item.selected').data('type');
  $(`.${data}`).fadeIn({ duration: 200 });

  bindIndividualAddFoodEvent();
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
    addOutputTitle();

    const price = Number($('.equal #price').val());
    const people = Number($('.equal #people').val());
    const amount = price / people;
    const html = `<p>Each person has to pay ${amount.toFixed(2)} baht</p>`;
    outputContent.append(html);
    output.slideDown();
  });

  $('.individual .add').on('click', function () {
    const rowCount = $('.individual .person').length;
    const nextNumber = rowCount + 1;
    const personRowHtml = `
      <div class="person item-${nextNumber}">
        <div class="row">
          <label>Name:</label>
          <input id="person-${nextNumber}-name" type="text" placeholder="Person ${nextNumber}" />
          <button class="remove-food" data-number="${nextNumber}">
              <i class="bi bi-dash"></i>
            </button>
          <button class="add-food" data-number="${nextNumber}">
            <i class="bi bi-plus"></i>
          </button>
        </div>
        <div class="row food">
          <label>Food 1:</label>
          <input id="person-${nextNumber}-price-1" type="number" placeholder="Food Price 1" />
        </div>
      </div>
    `;
    $(personRowHtml).insertAfter($('.individual .person')[rowCount - 1]);

    unbindIndividualAddFoodEvent();
    bindIndividualAddFoodEvent();
  });

  $('.individual .remove').on('click', function () {
    const rowCount = $('.individual .person').length;
    $('.individual .person').last().remove();
  });

  $('.individual .calc').on('click', function () {
    resetOutput();
    addOutputTitle();

    const vat = Number($('#individual-vat').val());
    const service = Number($('#individual-service').val());
    const discount = Number($('#individual-discount').val());
    let total = 0;

    $('.individual .person').each(function (index) {
      const number = index + 1;
      const name = $(`#person-${number}-name`).val();
      let amount = 0;

      $(`.individual .person [id^="person-${number}-price-"]`).each(
        function () {
          amount += Number($(this).val());
        }
      );

      const serviceAmount = (amount * service) / 100;
      const vatAmount = ((amount + serviceAmount) * vat) / 100;
      const totalAmount = amount + serviceAmount + vatAmount;
      const personHtml = `
        <p class="person">
          <span class="name">${name}</span>
          <span class="number">${amount}</span>
          ${
            service
              ? `<span>+</span><span class="number">${serviceAmount.toFixed(2)}</span>`
              : ''
          }
          ${vat ? `<span>+</span><span class="number">${vatAmount.toFixed(2)}</span>` : ''}
          ${
            vat || service
              ? `<span>=</span><span class="number">${totalAmount.toFixed(2)}</span>`
              : ''
          }
        </p>
      `;

      outputContent.append(personHtml);
      total += totalAmount;

      if (index === $('.individual .person').length - 1) {
        const totalHtml = `
          <p class="total">
            <span class="name">Total</span>
            <span class="number">${total.toFixed(2)}</span>
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
        }" type="number" placeholder="Food Price ${rowCount + 1}" />
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
            type="number"
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
            type="number"
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

  $('.other .calc').on('click', function () {
    resetOutput();
    addOutputTitle();

    const vat = Number($('#other-vat').val());
    const service = Number($('#other-service').val());
    const peopleArr = [];
    let numberOfPeople = Number($('#other-people').val());
    let numberOfExcludedPeople = Number($('.exclusion-item').length);
    let totalExcludedPeoplePrice = 0;
    let sharedItemPrice = 0;
    let total = 0;
    const sharedItemsCount = $('.shared-items [id^="food-price-"]').length;

    $('.shared-items [id^="food-price-"]').each(function () {
      sharedItemPrice += Number($(this).val());
    });

    $('.exclusion-item').each(function (index) {
      const number = index + 1;
      const name = $(`#exclusion-${number}-name`).val();
      const excludedItemsCount = $(
        `.exclusion-item.item-${number} [id^="exclusion-${number}-price-"]`
      ).length;
      let excludedItemPrice = 0;

      $(
        `.exclusion-item.item-${number} [id^="exclusion-${number}-price-"]`
      ).each(function (index) {
        excludedItemPrice += Number($(this).val());
      });

      let price = (sharedItemPrice - excludedItemPrice) / numberOfPeople;
      totalExcludedPeoplePrice += price;
      const person = {
        name,
        price,
      };
      peopleArr.push(person);
    });

    const sharedPeoplePrice =
      (sharedItemPrice - totalExcludedPeoplePrice) /
      (numberOfPeople - numberOfExcludedPeople);
    const person = {
      name: 'Shared',
      count: numberOfPeople - numberOfExcludedPeople,
      price: sharedPeoplePrice,
    };
    peopleArr.unshift(person);

    peopleArr.forEach((people, index) => {
      const name = `${people.name}${
        people.name === 'Shared' ? ` x ${people.count}` : ''
      }`;
      const amount = people.price;
      const serviceAmount = (people.price * service) / 100;
      const vatAmount = ((amount + serviceAmount) * vat) / 100;
      const totalAmount = amount + serviceAmount + vatAmount;
      const personHtml = `
        <p class="person">
          <span class="name">${name}</span>
          <span class="number">${amount.toFixed(2)}</span>
          <span>+</span>
          <span class="number">${serviceAmount.toFixed(2)}</span>
          <span>+</span>
          <span class="number">${vatAmount.toFixed(2)}</span>
          <span>=</span>
          <span class="number">${totalAmount.toFixed(2)}</span>
        </p>
      `;

      outputContent.append(personHtml);
      total +=
        people.name === 'Shared' ? totalAmount * people.count : totalAmount;

      if (index === peopleArr.length - 1) {
        const totalHtml = `
        <p class="total">
          <span class="name">Total</span>
          <span class="number">${total.toFixed(2)}</span>
        </p>
      `;
        outputContent.append(totalHtml);
      }
    });

    output.slideDown();
  });

  function resetOutput() {
    outputContent.empty();
    output.hide();
  }

  function addOutputTitle() {
    outputContent.append(`<h3>${$('#output-title').val()}</h3>`);
  }

  function bindIndividualAddFoodEvent() {
    $('.individual .person .add-food').on('click', function () {
      console.log('clicked');
      const itemNumber = $(this).data('number');
      const rowCount = $(
        `.individual .person.item-${itemNumber} .row.food`
      ).length;
      const nextNumber = rowCount + 1;
      const rowHtml = `
        <div class="row food">
          <label>Food ${nextNumber}:</label>
          <input
            id="person-${itemNumber}-price-${nextNumber}"
            type="number"
            placeholder="Food Price ${nextNumber}"
          />
        </div>
      `;

      if ($(`.individual .person.item-${itemNumber} .row.food`).length) {
        $(rowHtml).insertAfter(
          $(`.individual .person.item-${itemNumber} .row.food`)[rowCount - 1]
        );
      } else {
        $(rowHtml).insertAfter(
          $(`.individual .person.item-${itemNumber} .row`)
        );
      }
    });

    $('.individual .person .remove-food').off();

    $('.individual .person .remove-food').on('click', function () {
      const itemNumber = $(this).data('number');
      const rowCount = $(
        `.individual .person.item-${itemNumber} .row.food`
      ).length;
      $(`.individual .person.item-${itemNumber} .row.food`)[rowCount - 1].remove();
    });
  }

  function unbindIndividualAddFoodEvent() {
    $('.individual .person .add-food').off();
  }

  function bindExclusionAddFoodEvent() {
    $('.other .exclusion-item .add-food').on('click', function () {
      const itemNumber = $(this).data('number');
      const rowCount = $(
        `.other .exclusion-item.item-${itemNumber} .row.food`
      ).length;
      const nextNumber = rowCount + 1;
      const rowHtml = `
        <div class="row food">
          <input
            id="exclusion-${itemNumber}-price-${nextNumber}"
            type="number"
            placeholder="Food Price ${nextNumber}"
          />
          <button class="remove-food"><i class="bi bi-dash"></i></button>
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
      const itemNumber = $(this).data('number');
      const rowCount = $(
        `.other .addition-item.item-${itemNumber} .row.food`
      ).length;
      const nextNumber = rowCount + 1;
      const rowHtml = `
        <div class="row food">
          <input
            id="addition-${itemNumber}-price-${nextNumber}"
            type="number"
            placeholder="Food Price ${nextNumber}"
          />
          <button class="remove-food"><i class="bi bi-dash"></i></button>
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
